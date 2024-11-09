'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { parseQuery } from '@/utils/queryParser';

interface SearchQueryProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchQuery({ onSearch, isLoading = false }: SearchQueryProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showLatestOnly, setShowLatestOnly] = useState(false);

  const handleSearch = () => {
    const result = parseQuery(query);
    if (result.isValid) {
      setError(null);
      onSearch(query);
    } else {
      setError(result.error || 'Invalid query format');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a Search Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"Market Capitalization > 300 AND\nP/E Ratio < 15 AND\nROE > 22"}
              className="w-full h-32 px-4 py-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="latest-results"
                checked={showLatestOnly}
                onChange={(e) => setShowLatestOnly(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="latest-results" className="text-sm text-gray-300">
                Only companies with latest results
              </label>
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? 'Searching...' : 'Run This Query'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-900 border-blue-800">
        <CardHeader>
          <CardTitle>Custom query example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-1">
            <p>Market Capitalization &gt; 300 AND</p>
            <p>P/E Ratio &lt; 15 AND</p>
            <p>ROE &gt; 22</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}