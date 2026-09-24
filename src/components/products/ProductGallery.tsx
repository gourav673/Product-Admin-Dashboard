"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div className="space-y-3">
      <ProductImage src={current} alt={title} className="aspect-square w-full" />
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === selected}
              className={`rounded-md ring-2 ${index === selected ? "ring-indigo-600" : "ring-transparent"}`}
            >
              <ProductImage src={src} alt="" className="h-16 w-16" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
