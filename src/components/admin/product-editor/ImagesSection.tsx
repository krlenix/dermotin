'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePickerDialog } from '@/components/admin/ImagePickerDialog';
import { adminFetch } from '@/components/admin/api';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FolderOpen, ImagePlus, Loader2, X } from 'lucide-react';
import type { ProductDraft } from './draft';

type PickerTarget = 'main' | 'thumbnail' | 'fallback' | 'gallery-add' | { galleryIndex: number } | null;

const ACCEPT = '.png,.jpg,.jpeg,.webp,.avif';

/** Svetla šahovnica u pozadini preview-a — vidi se i transparentna slika */
const CHECKER_STYLE: React.CSSProperties = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
};

interface ImagesSectionProps {
  value: ProductDraft['images'];
  onChange: (images: ProductDraft['images']) => void;
  /** Folder za upload novih slika, npr. "products/fungel" */
  uploadFolder: string;
}

/** Upload jedne slike na admin API — vraća URL snimljene slike */
async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const data = await adminFetch<{ success: boolean; url: string }>('/api/admin/images/upload', {
    method: 'POST',
    body: formData,
  });
  return data.url;
}

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  title?: string;
  children: React.ReactNode;
}

/** Zona za upload: klik → file dialog, drag & drop sa vizuelnim highlight-om */
function DropZone({ onFiles, disabled, multiple, className, title, children }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={(e) => {
        // Ignoriši dragleave ka unutrašnjim elementima zone
        if (!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) {
          setDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        'relative transition',
        disabled ? 'cursor-wait' : 'cursor-pointer',
        dragOver && 'ring-2 ring-brand-orange',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
          e.target.value = '';
        }}
      />
      {children}
      {dragOver && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-brand-orange/15 text-sm font-semibold text-brand-orange">
          Pusti sliku ovde
        </div>
      )}
    </div>
  );
}

interface SingleImageCardProps {
  label: string;
  hint?: string;
  url: string;
  onUrlChange: (url: string) => void;
  uploadFolder: string;
  onPickFromGallery: () => void;
}

/** Kartica za main/thumbnail/fallback: veliki preview + drag&drop/klik upload + URL polje */
function SingleImageCard({ label, hint, url, onUrlChange, uploadFolder, onPickFromGallery }: SingleImageCardProps) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await uploadImage(file, uploadFolder);
      onUrlChange(uploadedUrl);
      toast.success(`Slika je otpremljena — ${label}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload nije uspeo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={onPickFromGallery}>
          <FolderOpen className="h-3.5 w-3.5" /> Iz galerije
        </Button>
      </div>
      <DropZone
        onFiles={handleFiles}
        disabled={uploading}
        className="overflow-hidden rounded-md border border-dashed border-gray-300 hover:border-brand-orange/60"
        title="Prevuci sliku ovde ili klikni za upload"
      >
        <div className="flex h-40 items-center justify-center" style={CHECKER_STYLE}>
          {url.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} className="max-h-40 max-w-full object-contain p-1" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-3 text-center text-xs text-gray-400">
              <ImagePlus className="h-6 w-6" />
              <span>Prevuci sliku ovde ili klikni za upload</span>
            </div>
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 text-sm font-medium text-gray-700">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Otpremanje…
          </div>
        )}
      </DropZone>
      <Input value={url} onChange={(e) => onUrlChange(e.target.value)} placeholder="/images/products/…" />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Sekcija SLIKE: main / thumbnail / fallback kartice + galerija (grid, upload, reorder) */
export function ImagesSection({ value, onChange, uploadFolder }: ImagesSectionProps) {
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [galleryUpload, setGalleryUpload] = useState<{ done: number; total: number } | null>(null);

  // Ref na poslednju vrednost — da asinhroni upload ne pregazi izmene u međuvremenu
  const valueRef = useRef(value);
  valueRef.current = value;

  const setField = (field: 'main' | 'thumbnail' | 'fallback', url: string) => {
    onChange({ ...valueRef.current, [field]: url });
  };

  const setGalleryItem = (index: number, url: string) => {
    const gallery = [...valueRef.current.gallery];
    gallery[index] = url;
    onChange({ ...valueRef.current, gallery });
  };

  const removeGalleryItem = (index: number) => {
    onChange({ ...valueRef.current, gallery: valueRef.current.gallery.filter((_, i) => i !== index) });
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= valueRef.current.gallery.length) return;
    const gallery = [...valueRef.current.gallery];
    [gallery[index], gallery[target]] = [gallery[target], gallery[index]];
    onChange({ ...valueRef.current, gallery });
  };

  const handleGalleryFiles = async (files: File[]) => {
    setGalleryUpload({ done: 0, total: files.length });
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        uploaded.push(await uploadImage(file, uploadFolder));
        setGalleryUpload({ done: uploaded.length, total: files.length });
      }
      toast.success(uploaded.length === 1 ? 'Slika je dodata u galeriju.' : `Dodato slika u galeriju: ${uploaded.length}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload nije uspeo.');
    } finally {
      if (uploaded.length > 0) {
        onChange({ ...valueRef.current, gallery: [...valueRef.current.gallery, ...uploaded] });
      }
      setGalleryUpload(null);
    }
  };

  const handlePickerSelect = (url: string) => {
    if (pickerTarget === 'main' || pickerTarget === 'thumbnail' || pickerTarget === 'fallback') {
      setField(pickerTarget, url);
    } else if (pickerTarget === 'gallery-add') {
      onChange({ ...valueRef.current, gallery: [...valueRef.current.gallery, url] });
    } else if (pickerTarget && typeof pickerTarget === 'object') {
      setGalleryItem(pickerTarget.galleryIndex, url);
    }
    setPickerTarget(null);
  };

  const singleFields: { field: 'main' | 'thumbnail' | 'fallback'; label: string; hint?: string }[] = [
    { field: 'main', label: 'Glavna slika (main)' },
    { field: 'thumbnail', label: 'Thumbnail' },
    { field: 'fallback', label: 'Fallback (opciono)', hint: 'Prikazuje se ako glavna slika ne može da se učita.' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {singleFields.map(({ field, label, hint }) => (
          <SingleImageCard
            key={field}
            label={label}
            hint={hint}
            url={value[field]}
            onUrlChange={(url) => setField(field, url)}
            uploadFolder={uploadFolder}
            onPickFromGallery={() => setPickerTarget(field)}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label>Galerija (redosled je bitan)</Label>
          <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => setPickerTarget('gallery-add')}>
            <FolderOpen className="h-3.5 w-3.5" /> Iz galerije
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {value.gallery.map((url, index) => (
            <div key={`${index}-${url}`} className="group relative overflow-hidden rounded-lg border bg-white">
              <div className="flex aspect-square items-center justify-center" style={CHECKER_STYLE}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Slika galerije ${index + 1}`} className="max-h-full max-w-full object-contain p-1" />
              </div>
              <p className="truncate border-t bg-white px-1.5 py-1 text-[10px] text-muted-foreground" title={url}>
                {url.split('/').pop()}
              </p>
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {index + 1}
              </span>
              <button
                type="button"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md border bg-white/90 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-red-50 focus-visible:opacity-100 group-hover:opacity-100"
                onClick={() => removeGalleryItem(index)}
                aria-label="Ukloni sliku"
                title="Ukloni sliku"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-7 left-1 right-1 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-md border bg-white/90 text-gray-700 shadow-sm hover:bg-white disabled:opacity-40"
                  disabled={index === 0}
                  onClick={() => moveGalleryItem(index, -1)}
                  aria-label="Pomeri levo"
                  title="Pomeri levo"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-md border bg-white/90 text-gray-700 shadow-sm hover:bg-white"
                  onClick={() => setPickerTarget({ galleryIndex: index })}
                  aria-label="Zameni sliku iz galerije fajlova"
                  title="Zameni sliku"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-md border bg-white/90 text-gray-700 shadow-sm hover:bg-white disabled:opacity-40"
                  disabled={index === value.gallery.length - 1}
                  onClick={() => moveGalleryItem(index, 1)}
                  aria-label="Pomeri desno"
                  title="Pomeri desno"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <DropZone
            onFiles={handleGalleryFiles}
            disabled={galleryUpload !== null}
            multiple
            className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 hover:border-brand-orange/60 hover:bg-orange-50/30"
            title="Prevuci jednu ili više slika, ili klikni za upload"
          >
            <div className="flex aspect-square flex-col items-center justify-center gap-1.5 px-3 text-center text-xs text-gray-400">
              {galleryUpload ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
                  <span className="font-medium text-gray-600">
                    Otpremanje… {galleryUpload.done}/{galleryUpload.total}
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="h-6 w-6" />
                  <span>Dodaj slike — prevuci ili klikni</span>
                </>
              )}
            </div>
          </DropZone>
        </div>
        {value.gallery.length === 0 && (
          <p className="text-xs text-muted-foreground">Galerija je prazna — dodaj slike preko pločice iznad.</p>
        )}
      </div>

      <ImagePickerDialog
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={handlePickerSelect}
        uploadFolder={uploadFolder}
      />
    </div>
  );
}
