'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [myTag, setMyTag] = useState('');
  const [draftTag, setDraftTag] = useState('');

  // On mount, load the saved tag
  useEffect(() => {
    const savedTag = localStorage.getItem('myPlayerTag');
    if (savedTag) {
      setMyTag(savedTag);
      setDraftTag(savedTag);
    }
  }, []);

  // Save to localStorage & state
  const saveTag = () => {
    const cleanTag = draftTag.trim();
    if (!cleanTag) return;
    localStorage.setItem('myPlayerTag', cleanTag);
    setMyTag(cleanTag);
  };

  // Clear the saved tag
  const clearTag = () => {
    localStorage.removeItem('myPlayerTag');
    setMyTag('');
    setDraftTag('');
  };

  return (
    <header className="bg-rose-950 mx-auto p-6 flex space-between">
      <Link href="/" className="p-[0.5rem] my-auto mx-[2rem]">
        {/* width/height are required */}
        <Image
          src="/favicon.ico"
          alt="CR Assistant Logo"
          width={120}
          height={120}
          priority={true} // preloads it for the LCP
        />
      </Link>{' '}
      <div className="relative mx-auto mb-4 mt-8 flex w-full items-center justify-between pb-2">
        {/* nav links */}
        <nav className="space-x-4 text-rose-100 *:p-2 *:bg-rose-500 *:rounded *:hover:bg-rose-600 *:hover:shadow-md">
          <a href="/" className="">
            Home
          </a>
          <a href="/ranking">Ranking</a>
          <a href="/playing">Playing</a>
          <a href="/testing">Testing</a>
          <a href="/admin">Admin</a>
        </nav>
        {/* stay‑logged‑in tag input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={draftTag}
            onChange={(e) => setDraftTag(e.target.value)}
            placeholder="#YOURTAG"
            className="p-2 border rounded text- bg-rose-950"
          />
          <button
            onClick={saveTag}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            {myTag ? 'Update' : 'Save'}
          </button>
          {myTag && (
            <button
              onClick={clearTag}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
