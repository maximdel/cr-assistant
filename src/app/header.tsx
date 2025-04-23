'use client';

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
    <div className="bg-blue-100 mx-auto space-y-4 p-6">
      <header className="relative mx-auto mb-4 mt-8 flex w-full items-center justify-between pb-2">
        {/* nav links */}
        <nav className="space-x-4 text-rose-100 *:p-2 *:bg-rose-500 *:rounded-xl">
          <a href="/">Home</a>
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
            className="p-2 border rounded text-black"
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
      </header>
    </div>
  );
}
