"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiTrash2, FiUpload } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import type { GalleryImage } from "@/lib/app.types";
import {
  deleteGalleryImage,
  revalidateGalleryPages,
  updateGalleryImage,
} from "@/app/(admin-protected)/admin/gallery/actions";
import AdminModal from "@/components/admin/AdminModal";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type Props = {
  images: GalleryImage[];
};

function extensionForMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export default function GalleryAdmin({ images }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const nextSort =
      images.reduce((max, image) => Math.max(max, image.sort_order), 0) + 1;

    setUploading(true);
    let uploaded = 0;
    let sortOrder = nextSort;

    try {
      for (const file of files) {
        if (!ALLOWED_TYPES.has(file.type)) {
          toast.error(`${file.name} must be a JPEG, PNG, or WebP.`);
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`${file.name} is larger than 5MB.`);
          continue;
        }

        const storagePath = `${crypto.randomUUID()}.${extensionForMime(file.type)}`;
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          toast.error(`Upload failed for ${file.name}: ${uploadError.message}`);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("gallery").getPublicUrl(storagePath);

        const { error: insertError } = await supabase
          .from("gallery_images")
          .insert({
            storage_path: storagePath,
            image_url: publicUrl,
            caption: null,
            alt_text: "",
            sort_order: sortOrder,
            is_active: true,
          });

        if (insertError) {
          await supabase.storage.from("gallery").remove([storagePath]);
          toast.error(`Could not save ${file.name}: ${insertError.message}`);
          continue;
        }

        sortOrder += 1;
        uploaded += 1;
      }

      if (uploaded > 0) {
        toast.success(
          uploaded === 1 ? "Image uploaded." : `${uploaded} images uploaded.`,
        );
        await revalidateGalleryPages();
        router.refresh();
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (formData: FormData) => {
    const id = Number(formData.get("id"));
    setSavingId(id);
    try {
      const result = await updateGalleryImage(formData);
      if (result.success) {
        toast.success("Image updated.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update image.");
      }
    } catch {
      toast.error("Failed to update image.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteGalleryImage(
        deleting.id,
        deleting.storage_path,
      );
      if (result.success) {
        toast.success("Image deleted.");
        setDeleting(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete image.");
      }
    } catch {
      toast.error("Failed to delete image.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-questrial text-sm text-gray-500">
          JPEG, PNG, or WebP. Max 5MB per file.
        </p>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(event) => handleUpload(event.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="btnSaveYlw inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FiUpload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload images"}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500">
          No images yet
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <form
              key={image.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              onSubmit={(event) => {
                event.preventDefault();
                handleSave(new FormData(event.currentTarget));
              }}
            >
              <div className="relative aspect-4/3 bg-gray-100">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || image.caption || "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-4">
                <input type="hidden" name="id" value={image.id} />
                <div>
                  <label
                    className="labelx block text-xs"
                    htmlFor={`caption-${image.id}`}
                  >
                    Caption
                  </label>
                  <input
                    id={`caption-${image.id}`}
                    name="caption"
                    defaultValue={image.caption ?? ""}
                    className="inputx text-sm"
                    disabled={savingId === image.id}
                  />
                </div>
                <div>
                  <label
                    className="labelx block text-xs"
                    htmlFor={`alt-${image.id}`}
                  >
                    Alt text
                  </label>
                  <input
                    id={`alt-${image.id}`}
                    name="alt_text"
                    defaultValue={image.alt_text}
                    className="inputx text-sm"
                    disabled={savingId === image.id}
                  />
                </div>
                <div>
                  <label
                    className="labelx block text-xs"
                    htmlFor={`sort-${image.id}`}
                  >
                    Sort order
                  </label>
                  <input
                    id={`sort-${image.id}`}
                    name="sort_order"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={image.sort_order}
                    className="inputx text-sm"
                    disabled={savingId === image.id}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    className="btnSaveYlw disabled:opacity-60"
                    disabled={savingId === image.id}
                  >
                    {savingId === image.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(image)}
                    className="inline-flex items-center gap-2 rounded px-4 py-2 font-questrial text-sm font-medium text-red-600 uppercase hover:bg-red-50"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      )}

      {deleting && (
        <AdminModal
          open
          onClose={() => setDeleting(null)}
          title="Delete image"
          titleTone="danger"
          closeDisabled={isDeleting}
          footer={
            <>
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={isDeleting}
                className="btnCancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          }
        >
          <p className="font-questrial text-gray-700">
            Delete <strong>{deleting.caption || deleting.storage_path}</strong>?
            This removes the file from storage and cannot be undone.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
