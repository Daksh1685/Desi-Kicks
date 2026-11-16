import React, { useState, useRef } from 'react';
import { isSupabaseConfigured, uploadImageToSupabase } from '../../lib/supabase';
import { inputCls } from './adminTypes';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'hero';
  required?: boolean;
  helperText?: string;
  compact?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'products',
  required = false,
  helperText,
  compact = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. If Supabase is configured, upload to storage bucket
      if (isSupabaseConfigured) {
        const publicUrl = await uploadImageToSupabase(file, folder);
        if (publicUrl) {
          onChange(publicUrl);
          setIsUploading(false);
          return;
        }
      }

      // 2. Fallback: local FileReader data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file locally.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError('Error processing image upload.');
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
        >
          {showUrlInput ? 'Hide URL input' : 'Paste URL directly'}
        </button>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone / Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : value
              ? 'border-gray-200 bg-gray-50/60'
              : 'border-gray-300 hover:border-gray-400 bg-white'
        } ${compact ? 'p-2.5' : 'p-3.5'}`}
      >
        {value ? (
          /* Image Preview with controls */
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-neutral-100 shadow-2xs">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">Image Selected</p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {value.startsWith('data:') ? 'Local file uploaded' : value}
              </p>

              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-[11px] font-semibold text-primary hover:text-[#8a2600] cursor-pointer"
                >
                  Change File
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="text-[11px] font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Upload Prompt */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-3 text-center cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-orange-50 text-primary flex items-center justify-center mb-1.5 group-hover:bg-primary group-hover:text-white transition">
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-primary transition">
              {isUploading ? 'Uploading Image...' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
          </div>
        )}
      </div>

      {/* Direct URL input fallback */}
      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste https:// image URL or /hero/... path"
          className={inputCls + ' text-xs mt-1.5'}
        />
      )}

      {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
      {helperText && !uploadError && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}
