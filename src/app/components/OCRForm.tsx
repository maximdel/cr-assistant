// OCRForm.tsx
'use client';

import { useState } from 'react';

interface OCRFormProps {
  onSubmit: (imageBase64: string) => Promise<void>;
}

export default function OCRForm({ onSubmit }: OCRFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      await onSubmit(base64);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Upload & OCR'}
      </button>
    </form>
  );
}
