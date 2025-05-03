// File: src/app/ocr/page.tsx
'use client';

import OCRForm from '@/app/components/OCRForm';
import { useState } from 'react';

export default function OCRPage() {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOCR(imageBase64: string) {
    setLoading(true);
    setError(null);
    setText(null);
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'OCR failed');
      }
      const data = await res.json();
      setText(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">OCR Screenshot</h1>
      <OCRForm onSubmit={handleOCR} />
      {loading && <p>Processing…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {text && (
        <div>
          <h2 className="font-semibold">Extracted Text</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {text}
          </pre>
        </div>
      )}
    </main>
  );
}
