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
    <div className={`aspect-video w-full overflow-hidden bg-slate-100 ${className}`}>
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-400">
          <ImageOff className="h-7 w-7" aria-hidden="true" />
          <span className="text-xs font-medium">Thumbnail belum tersedia</span>
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
