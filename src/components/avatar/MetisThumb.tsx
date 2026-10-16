import thumb from '../../assets/metis-thumb.png';

/**
 * Small decorative Metis thumbnail (24–46 px): a 96 px grayscale raster, cheaper than the animated SVG.
 * Always decorative — the surrounding text names Metis.
 */
export function MetisThumb({
  size,
  corner = false,
  className = '',
}: {
  size: number;
  corner?: boolean;
  className?: string;
}) {
  const cornerSize = Math.max(6, Math.round(size / 4));
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 overflow-hidden border border-ink bg-surface ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={thumb}
        alt=""
        width={size}
        height={size}
        decoding="async"
        className="block size-full object-cover mix-blend-multiply"
      />
      {corner && (
        <span
          className="absolute right-0 bottom-0 bg-accent"
          style={{ width: cornerSize, height: cornerSize }}
        />
      )}
    </span>
  );
}
