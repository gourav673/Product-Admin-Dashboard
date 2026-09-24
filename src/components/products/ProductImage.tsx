"use client";

/* eslint-disable @next/next/no-img-element --
   Image URLs can be typed in by the user (any domain), which next/image would reject. */

import { useState } from "react";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = "h-12 w-12" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400 ${className}`}
        aria-label={`${alt} (no image)`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-md bg-slate-100 object-cover ${className}`}
    />
  );
}
