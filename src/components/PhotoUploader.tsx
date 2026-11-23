import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ReportService } from '../services/reports';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onChange,
  maxPhotos = 4,
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    const availableSlots = maxPhotos - photos.length;
    if (availableSlots <= 0) return;

    const filesToProcess = validFiles.slice(0, availableSlots);
    setIsCompressing(true);

    try {
      const compressedUrls: string[] = [];
      for (const file of filesToProcess) {
        const compressed = await ReportService.compressImage(file);
        compressedUrls.push(compressed);
      }
      onChange([...photos, ...compressedUrls]);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      {photos.length < maxPhotos && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200
            ${dragActive
              ? 'border-spatial-blue bg-spatial-blue/10 scale-[1.01]'
              : 'border-white/15 dark:border-white/15 light:border-slate-300 hover:border-spatial-blue/60 bg-white/5 dark:bg-white/5 light:bg-slate-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-spatial-blue/15 text-spatial-blue flex items-center justify-center">
              {isCompressing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-spatial-text">
                Add photos of the issue
              </p>
              <p className="text-xs text-spatial-muted mt-0.5">
                Photos help authorities understand and resolve the issue faster.
              </p>
            </div>

            <div className="text-[11px] text-spatial-muted/80 mt-1 flex items-center gap-1.5 font-mono">
              <span>Drag & drop or browse</span>
              <span>•</span>
              <span>Max {maxPhotos} photos (up to 10MB each)</span>
            </div>
          </div>
        </div>
      )}

      {/* Previews Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden aspect-video sm:aspect-square bg-black/40 border border-white/10"
            >
              <img
                src={photo}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors shadow-md"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white">
                Photo {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
