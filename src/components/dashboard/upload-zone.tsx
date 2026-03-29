'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/utils/compress-image';
import Image from 'next/image';

interface UploadZoneProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  isLoading?: boolean;
}

export function UploadZone({ onImageSelected, isLoading }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);
        setPreview(previewUrl);
        onImageSelected(compressed, previewUrl);
      } catch (err) {
        console.error('Compression error:', err);
      } finally {
        setIsCompressing(false);
      }
    },
    [onImageSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled: isLoading || isCompressing,
  });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer',
        isDragActive
          ? 'border-blue-500 bg-blue-500/5'
          : 'border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20',
        preview && 'border-solid',
        (isLoading || isCompressing) && 'opacity-60 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-sm font-medium">Trocar imagem</p>
          </div>
          <button
            onClick={clear}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ring-1 ring-white/10">
            {isCompressing ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              {isCompressing ? 'Otimizando imagem...' : 'Arraste sua foto aqui'}
            </h3>
            <p className="text-sm text-slate-500">Ou clique para selecionar (JPEG, PNG, WebP)</p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ImageIcon className="w-3.5 h-3.5" />
              Melhor qualidade
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              ✨ IA Refinadora Ativa
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
