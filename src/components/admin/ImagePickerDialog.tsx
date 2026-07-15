'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminFetch } from './api';
import { Upload } from 'lucide-react';

interface ImagePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** Folder u koji upload ide, npr. "products/fungel" */
  uploadFolder?: string;
}

interface ImagesResponse {
  success: boolean;
  images: string[];
  byFolder: Record<string, string[]>;
}

/** Dijalog za izbor postojeće slike iz public/images ili upload nove */
export function ImagePickerDialog({ open, onClose, onSelect, uploadFolder = 'products' }: ImagePickerDialogProps) {
  const [images, setImages] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    adminFetch<ImagesResponse>('/api/admin/images')
      .then((data) => setImages(data.images))
      .catch((e) => setError(e instanceof Error ? e.message : 'Greška pri učitavanju slika.'))
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return images;
    return images.filter((url) => url.toLowerCase().includes(query));
  }, [images, search]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);
      const data = await adminFetch<{ success: boolean; url: string }>('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });
      setImages((prev) => [data.url, ...prev]);
      onSelect(data.url);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload nije uspeo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Izaberi sliku</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input placeholder="Pretraga po imenu ili folderu…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
          <Button type="button" variant="outline" className="gap-2 shrink-0" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" /> {uploading ? 'Upload…' : 'Nova slika'}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex-1 overflow-y-auto mt-2">
          {loading ? (
            <p className="text-sm text-muted-foreground p-4">Učitavanje…</p>
          ) : (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))]">
              {filtered.map((url) => (
                <button
                  key={url}
                  type="button"
                  className="group border rounded-lg overflow-hidden bg-white hover:ring-2 hover:ring-brand-orange transition text-left"
                  onClick={() => {
                    onSelect(url);
                    onClose();
                  }}
                  title={url}
                >
                  <div className="flex aspect-square items-center justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={url} loading="lazy" className="max-h-full max-w-full object-contain p-1" />
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1.5 py-1 truncate">{url.split('/').pop()}</p>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full p-4">Nema slika za dati filter.</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
