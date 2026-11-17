import Image from "next/image";

const OPTIMISED_HOSTS = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
]);

/**
 * Uses Next/Image optimisation for configured image hosts, and falls back to a
 * plain lazy image for arbitrary CMS URLs so an admin-supplied URL never breaks
 * page rendering. SVG sources are not passed through the image optimizer.
 */
export function SmartImage({
  src,
  alt,
  className,
  width = 1200,
  height = 800,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  let host = "";
  try {
    host = new URL(src).hostname;
  } catch {
    host = "";
  }
  const canOptimise = OPTIMISED_HOSTS.has(host) && !/\.svg(\?|$)/i.test(src);

  if (!canOptimise) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
