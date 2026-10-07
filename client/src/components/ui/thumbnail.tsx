import { ImageOff } from 'lucide-react';
import { useState } from 'react';

interface ThumbnailProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function Thumbnail({ src, alt, className = '' }: ThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div className={`aspect-video w-full overflow-hidden bg-stone-100 ${className}`}>
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-stone-400">
          <ImageOff className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs">Thumbnail belum tersedia</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
