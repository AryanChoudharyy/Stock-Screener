'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchQuery from '@/components/SearchQuery';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    router.push(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Stock Screener</h1>
          <p className="text-gray-400">
            Search through stocks using custom criteria like market capitalization,
            P/E ratio, ROE, and more.
          </p>
        </div>

        <div className="mt-8">
          <SearchQuery onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}