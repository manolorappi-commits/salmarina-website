import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function MenuImage({ src, alt, priority }: Props) {
  return (
    <figure className="overflow-hidden rounded-xl shadow-sm border border-brand-mint/20 bg-brand-sea">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={1600}
        className="w-full h-auto object-contain"
        sizes="(max-width: 768px) 100vw, 720px"
        priority={priority}
      />
    </figure>
  );
}
