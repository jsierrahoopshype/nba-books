'use client';

import { useState } from 'react';

interface BookCoverImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function BookCoverImage({ src, alt, className }: BookCoverImageProps) {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No Cover</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}