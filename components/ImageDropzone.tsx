"use client";

import { useCallback, useRef, useState } from "react";

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string; // base64 data URL, sent to the API
  mediaType: string;
  maybeCutOff: boolean; // heuristic warning flag
}

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILES = 12;

// Very rough heuristic: a screenshot that ends abruptly on non-empty pixels
// near the bottom edge is probably cut off mid-sentence. We sample the bottom
// rows and flag if a meaningful fraction is non-white.
async function detectCutOff(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = (canvas.width = img.naturalWidth);
        const h = (canvas.height = img.naturalHeight);
        const ctx = canvas.getContext("2d");
        if (!ctx || w === 0 || h === 0) return resolve(false);
        ctx.drawImage(img, 0, 0);
        const bandHeight = Math.max(2, Math.floor(h * 0.02));
        const band = ctx.getImageData(0, h - bandHeight, w, bandHeight).data;
        let dark = 0;
        let total = 0;
        for (let i = 0; i < band.length; i += 4) {
          const lum =
            0.299 * band[i] + 0.587 * band[i + 1] + 0.114 * band[i + 2];
          total++;
          if (lum < 200) dark++;
        }
        // If >6% of the bottom band is non-light, it likely ends mid-content.
        resolve(total > 0 && dark / total > 0.06);
      } catch {
        resolve(false);
      }
    };
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageDropzone({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (next: UploadedImage[]) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const incoming = Array.from(files).filter((f) =>
        ACCEPTED.includes(f.type),
      );
      const room = MAX_FILES - images.length;
      const slice = incoming.slice(0, Math.max(0, room));

      const processed: UploadedImage[] = [];
      for (const file of slice) {
        const dataUrl = await readAsDataUrl(file);
        const maybeCutOff = await detectCutOff(dataUrl);
        processed.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          name: file.name,
          dataUrl,
          mediaType: file.type === "image/jpg" ? "image/jpeg" : file.type,
          maybeCutOff,
        });
      }
      onChange([...images, ...processed]);
    },
    [images, onChange],
  );

  const remove = (id: string) => onChange(images.filter((i) => i.id !== id));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-crimson bg-crimson/5"
            : "border-ink/20 bg-linen/60 hover:border-crimson/40 hover:bg-linen"
        }`}
      >
        <svg
          className="mb-3 h-8 w-8 text-crimson"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 16V4m0 0L8 8m4-4l4 4M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[15px] font-medium text-ink">
          Drag &amp; drop screenshots, or click to upload
        </p>
        <p className="mt-1 text-sm text-ink/50">
          PNG, JPG, or WebP · up to {MAX_FILES} images
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-ink/10 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.dataUrl}
                alt={img.name}
                className="h-32 w-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => remove(img.id)}
                aria-label={`Remove ${img.name}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 3.5l7 7m0-7l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {img.maybeCutOff && (
                <div className="absolute inset-x-0 bottom-0 bg-crimson/90 px-2 py-1 text-[11px] font-medium text-white">
                  Might be cut off — expand &amp; re-upload?
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
