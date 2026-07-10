"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

type AvatarUploadProps = {
  currentPhotoUrl: string | null;
  displayInitials: string;
  onFileSelected: (file: File) => void;
};

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload({
  currentPhotoUrl,
  displayInitials,
  onFileSelected,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onFileSelected(file);
  }

  const shownPhoto = previewUrl ?? currentPhotoUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-24 w-24 rounded-full overflow-hidden border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#211E19] dark:bg-[#C9A46A]/20"
        aria-label="Change profile photo"
      >
        {shownPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shownPhoto}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-2xl text-[#F6F3EC] dark:text-[#C9A46A]">
            {displayInitials}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera size={18} className="text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-xs text-[#8A6B3B] dark:text-[#C9A46A] underline underline-offset-4"
      >
        Change photo
      </button>

      {error && (
        <p className="text-xs text-[#A3402F] dark:text-[#E0836F]">{error}</p>
      )}
    </div>
  );
}