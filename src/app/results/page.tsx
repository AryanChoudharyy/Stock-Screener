'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchQuery from '@/components/SearchQuery';
import ResultsTable from '@/components/ResultsTable';
import Pagination from '@/components/Pagination';
import { Stock, SortConfig, PageSize, ColumnConfig } from '@/types/stock';
import { parseQuery } from '@/utils/queryParser';
import { filterStocks, sortStocks, paginateStocks } from '@/utils/stockFilter';

// Default column configuration
const defaultColumns: Array<ColumnConfig> = [
  { field: 'Ticker', label: 'Ticker', width: 'w-24' },
  { field: 'Market Capitalization (B)', label: 'Market Cap (B)', width: 'w-32' },
  { field: 'P/E Ratio', label: 'P/E', width: 'w-24' },
  { field: 'ROE (%)', label: 'ROE %', width: 'w-24' },
  { field: 'Debt-to-Equity Ratio', label: 'D/E', width: 'w-24' },
  { field: 'Dividend Yield (%)', label: 'Div Yield %', width: 'w-28' },
  { field: 'Revenue Growth (%)', label: 'Rev Growth %', width: 'w-32' },
  { field: 'EPS Growth (%)', label: 'EPS Growth %', width: 'w-32' },
  { field: 'Current Ratio', label: 'Current Ratio', width: 'w-32' },
  { field: 'Gross Margin (%)', label: 'Gross Margin %', width: 'w-36' }
];

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.get('q') || '';

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<Array<ColumnConfig>>(defaultColumns);
  const [queryName, setQueryName] = useState<string>('');
  const [queryDescription, setQueryDescription] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedColumns = localStorage.getItem('columnOrder');
      if (savedColumns) {
        try {
          const parsed = JSON.parse(savedColumns);
          setColumnOrder(parsed);
        } catch (e) {
          console.error('Error parsing saved column order:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const loadStocksAndFilter = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/stocks.json');
        if (!response.ok) {
          throw new Error('Failed to load stocks data');
        }

        const data = await response.json();

        const processedStocks = data.stocks.map((stock: Stock) => ({
          ...stock,
          'Market Capitalization (B)': Number(stock['Market Capitalization (B)']),
          'P/E Ratio': Number(stock['P/E Ratio']),
          'ROE (%)': Number(stock['ROE (%)']),
          'Debt-to-Equity Ratio': Number(stock['Debt-to-Equity Ratio']),
          'Dividend Yield (%)': Number(stock['Dividend Yield (%)']),
          'Revenue Growth (%)': Number(stock['Revenue Growth (%)']),
          'EPS Growth (%)': Number(stock['EPS Growth (%)']),
          'Current Ratio': Number(stock['Current Ratio']),
          'Gross Margin (%)': Number(stock['Gross Margin (%)'])
        }));

        setStocks(processedStocks);

        if (queryString) {
          const result = parseQuery(queryString);
          if (result.isValid) {
            const filtered = filterStocks(processedStocks, result.conditions);
            setFilteredStocks(filtered);
            setError(null);
          } else {
            setError(result.error || 'Invalid query format');
          }
        } else {
          setFilteredStocks(processedStocks);
        }
      } catch (error) {
        console.error('Error loading stocks:', error);
        setError('Failed to load stock data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStocksAndFilter();
  }, [queryString]);

  const handleSearch = (newQuery: string) => {
    setIsLoading(true);
    try {
      const result = parseQuery(newQuery);
      if (result.isValid) {
        const filtered = filterStocks(stocks, result.conditions);
        setFilteredStocks(filtered);
        setCurrentPage(1);
        setError(null);
        router.push(`/results?q=${encodeURIComponent(newQuery)}`);
      } else {
        setError(result.error || 'Invalid query format');
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setError('Error processing query');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryDetailsUpdate = (name: string, description: string) => {
    setQueryName(name);
    setQueryDescription(description);
  };

  const handleColumnOrderChange = (newColumns: Array<ColumnConfig>) => {
    setColumnOrder(newColumns);
    localStorage.setItem('columnOrder', JSON.stringify(newColumns));
  };

  const handleSort = (field: keyof Stock) => {
    setSortConfig(prevConfig => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const sortedStocks = sortStocks(filteredStocks, sortConfig);
  const paginatedStocks = paginateStocks(sortedStocks, currentPage, pageSize);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading results...</p>
            </div>
          )}

          {!isLoading && filteredStocks.length > 0 && (
            <div className="space-y-4">
              <ResultsTable
                stocks={paginatedStocks}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                sortConfig={sortConfig}
                onSort={handleSort}
                totalResults={filteredStocks.length}
                currentQuery={queryString}
                queryName={queryName}
                queryDescription={queryDescription}
                onQueryDetailsUpdate={handleQueryDetailsUpdate}
                savedColumnOrder={columnOrder}
                onColumnOrderChange={handleColumnOrderChange}
              />

              <Pagination
                currentPage={currentPage}
                totalItems={filteredStocks.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}

          {!isLoading && filteredStocks.length === 0 && !error && (
            <div className="text-center py-8 text-gray-400">
              No stocks found matching your criteria.
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-semibold mb-6">Try Another Search</h2>
            <SearchQuery onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </Suspense>
  );
}
