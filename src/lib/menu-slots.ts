export type MenuUploadSlot = {
  id: string;
  label: string;
  /** content file to update */
  contentFile: "menu.json" | "menu-vorschlaege.json";
  /** how to patch JSON */
  kind: "category" | "category-multi" | "monatskarte" | "mittags" | "tier" | "overview";
  categoryId?: string;
  imageIndex?: number;
  tierId?: string;
  accept: string;
  defaultFilename: string;
};

export const MENU_UPLOAD_SLOTS: MenuUploadSlot[] = [
  {
    id: "salate",
    label: "Speisekarte: Salate",
    contentFile: "menu.json",
    kind: "category",
    categoryId: "salate",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "salate.jpg",
  },
  {
    id: "teigwaren",
    label: "Speisekarte: Teigwaren",
    contentFile: "menu.json",
    kind: "category",
    categoryId: "teigwaren",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "teigwaren.jpg",
  },
  {
    id: "fleisch-fisch",
    label: "Speisekarte: Fleisch & Fisch",
    contentFile: "menu.json",
    kind: "category",
    categoryId: "fleisch-fisch",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "fleisch-fisch.jpg",
  },
  {
    id: "pizza",
    label: "Speisekarte: Pizza",
    contentFile: "menu.json",
    kind: "category",
    categoryId: "pizza",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "pizza.jpg",
  },
  {
    id: "dessert-1",
    label: "Speisekarte: Dessert (1)",
    contentFile: "menu.json",
    kind: "category-multi",
    categoryId: "dessert",
    imageIndex: 0,
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "dessert-1.jpg",
  },
  {
    id: "dessert-2",
    label: "Speisekarte: Dessert (2)",
    contentFile: "menu.json",
    kind: "category-multi",
    categoryId: "dessert",
    imageIndex: 1,
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "dessert-2.jpg",
  },
  {
    id: "monatskarte",
    label: "Monatskarte",
    contentFile: "menu.json",
    kind: "monatskarte",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "monatskarte.jpg",
  },
  {
    id: "mittags",
    label: "Mittagsmenü",
    contentFile: "menu.json",
    kind: "mittags",
    accept: "image/jpeg,image/png,image/webp,application/pdf",
    defaultFilename: "mittagsmenu.jpg",
  },
  {
    id: "overview",
    label: "Menüvorschläge Übersicht (PDF)",
    contentFile: "menu-vorschlaege.json",
    kind: "overview",
    accept: "application/pdf",
    defaultFilename: "menuevorschlaege-uebersicht.pdf",
  },
  ...(["eisen", "aluminium", "kupfer", "silber", "gold", "diamant"] as const).map((id) => ({
    id,
    label: `Menüvorschlag: ${id.charAt(0).toUpperCase()}${id.slice(1)}`,
    contentFile: "menu-vorschlaege.json" as const,
    kind: "tier" as const,
    tierId: id,
    accept: "application/pdf",
    defaultFilename: `${id}.pdf`,
  })),
];

export function getMenuSlot(id: string): MenuUploadSlot | undefined {
  return MENU_UPLOAD_SLOTS.find((s) => s.id === id);
}
