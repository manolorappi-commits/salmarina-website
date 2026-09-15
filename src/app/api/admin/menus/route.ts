import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMenuSlot, MENU_UPLOAD_SLOTS } from "@/lib/menu-slots";

export const dynamic = "force-dynamic";

function patchContentJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  slot: ReturnType<typeof getMenuSlot>,
  url: string,
) {
  if (!slot) return data;
  if (slot.kind === "category" && slot.categoryId) {
    const cat = data.categories?.find((c: { id: string }) => c.id === slot.categoryId);
    if (cat) cat.image = url;
  } else if (slot.kind === "category-multi" && slot.categoryId != null && slot.imageIndex != null) {
    const cat = data.categories?.find((c: { id: string }) => c.id === slot.categoryId);
    if (cat) {
      if (!Array.isArray(cat.images)) cat.images = [];
      cat.images[slot.imageIndex] = url;
    }
  } else if (slot.kind === "monatskarte") {
    data.monatskarte.image = url;
  } else if (slot.kind === "mittags") {
    data.mittagsmenus.image = url;
  } else if (slot.kind === "tier" && slot.tierId) {
    const tier = data.tiers?.find((t: { id: string }) => t.id === slot.tierId);
    if (tier) tier.pdf = url;
  } else if (slot.kind === "overview") {
    data.overviewPdf = url;
  }
  return data;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  const assets = await prisma.menuAsset.findMany({ orderBy: { slot: "asc" } });
  return NextResponse.json({
    slots: MENU_UPLOAD_SLOTS.map((s) => ({
      id: s.id,
      label: s.label,
      accept: s.accept,
      defaultFilename: s.defaultFilename,
    })),
    assets,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const slotId = String(form.get("slot") || "").trim();
    const file = form.get("file");

    const slot = getMenuSlot(slotId);
    if (!slot) {
      return NextResponse.json({ error: "Unbekannter Upload-Slot." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Datei fehlt." }, { status: 400 });
    }

    const ext = path.extname(file.name) || path.extname(slot.defaultFilename) || ".bin";
    const safeName = `${slot.id}-${Date.now()}${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";

    let publicUrl: string;
    let filename: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`menus/${safeName}`, bytes, {
        access: "public",
        contentType: mimeType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      publicUrl = blob.url;
      filename = safeName;
    } else if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Auf Vercel ist BLOB_READ_WRITE_TOKEN nicht gesetzt. Bitte Vercel Blob konfigurieren oder lokal hochladen.",
        },
        { status: 503 },
      );
    } else {
      // Local: write into public/menus/
      filename = slot.defaultFilename;
      const dest = path.join(process.cwd(), "public", "menus", filename);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, bytes);
      publicUrl = `/menus/${filename}`;
    }

    // Update content JSON (local filesystem; on Vercel Blob we still try — ephemeral FS may not persist)
    const contentPath = path.join(process.cwd(), "content", slot.contentFile);
    try {
      const raw = await fs.readFile(contentPath, "utf8");
      const data = JSON.parse(raw);
      patchContentJson(data, slot, publicUrl);
      await fs.writeFile(contentPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    } catch (e) {
      console.warn("[admin/menus] content JSON update skipped:", e);
    }

    const asset = await prisma.menuAsset.upsert({
      where: { slot: slot.id },
      update: { filename, url: publicUrl, mimeType },
      create: { slot: slot.id, filename, url: publicUrl, mimeType },
    });

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      asset,
      warning: process.env.BLOB_READ_WRITE_TOKEN
        ? null
        : "Lokal gespeichert unter public/menus/. Auf Vercel bitte BLOB_READ_WRITE_TOKEN setzen.",
    });
  } catch (err) {
    console.error("[admin/menus]", err);
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }
}
