// src/app/api/ocr/route.ts
import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // instead of file.arrayBuffer(), wrap in a Response:
  const arrayBuffer = await new Response(file).arrayBuffer();
  const imgBuffer = Buffer.from(arrayBuffer);

  // run OCR (adjust path/language as needed)
  const {
    data: { text },
  } = await Tesseract.recognize(imgBuffer, 'eng');

  return NextResponse.json({ text });
}
