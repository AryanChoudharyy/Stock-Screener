'use client';

import React, { useState } from 'react';
import { ArrowUpDown, Cloud, Settings } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Stock, SortConfig } from '@/types/stock';
import SaveQueryModal from './SaveQueryModal';
import ManageColumnsModal from './ManageColumnsModal';

interface ResultsTableProps {
  stocks: Stock[];
  currentPage: number;
  itemsPerPage: number;
  sortConfig: SortConfig;
  onSort: (field: keyof Stock) => void;
  totalResults: number;
  currentQuery: string;
  queryName: string;
  queryDescription: string;
  onQueryDetailsUpdate: (name: string, description: string) => void;
  savedColumnOrder?: Array<{ field: keyof Stock; label: string; width: string }>;
  onColumnOrderChange?: (columns: Array<{ field: keyof Stock; label: string; width: string }>) => void;
}

const defaultColumns: Array<{ field: keyof Stock; label: string; width: string }> = [
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

export default function ResultsTable({
  stocks,
  currentPage,
  itemsPerPage,
  sortConfig,
  onSort,
  totalResults,
  currentQuery,
  queryName,
  queryDescription,
  onQueryDetailsUpdate,
  savedColumnOrder,
  onColumnOrderChange
}: ResultsTableProps) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
  const [columns, setColumns] = useState(savedColumnOrder || defaultColumns);

  const getSortIcon = (field: keyof Stock) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleSaveQuery = (name: string, description: string, isPublic: boolean) => {
    onQueryDetailsUpdate(name, description);
  };

  const handleSaveColumns = (newColumns: Array<{ field: keyof Stock; label: string; width: string }>) => {
    setColumns(newColumns);
    onColumnOrderChange?.(newColumns);
    localStorage.setItem('columnOrder', JSON.stringify(newColumns));
  };

  const handleResetColumns = () => {
    setColumns(defaultColumns);
    onColumnOrderChange?.(defaultColumns);
    localStorage.removeItem('columnOrder');
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Header section with title and buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {queryName || 'Query Results'}
              </h2>
              <div className="text-sm mt-1">
                {queryDescription ? (
                  <p className="text-gray-400">{queryDescription}</p>
                ) : (
                  <p className="text-gray-400">
                    {totalResults} results found: Showing page {currentPage} of{' '}
                    {Math.ceil(totalResults / itemsPerPage)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors"
                onClick={() => setIsSaveModalOpen(true)}
              >
                <Cloud className="h-4 w-4" />
                <span>Save this query</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsManageColumnsOpen(true)}
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10 flex items-center gap-2 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Edit columns</span>
              </Button>
            </div>
          </div>

          {/* Results count if we have a description */}
          {queryDescription && (
            <p className="text-sm text-gray-400">
              {totalResults} results found: Showing page {currentPage} of{' '}
              {Math.ceil(totalResults / itemsPerPage)}
            </p>
          )}
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className={`${column.width} px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky top-0`}
                  >
                    <button
                      onClick={() => onSort(column.field)}
                      className="flex items-center gap-1 hover:text-white focus:outline-none group w-full"
                    >
                      <span>{column.label}</span>
                      <span className="text-gray-500 group-hover:text-white">
                        {getSortIcon(column.field)}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, idx) => (
                <tr 
                  key={stock.Ticker} 
                  className={`${
                    idx % 2 === 0 ? 'bg-gray-900/50' : ''
                  } hover:bg-gray-800/50 transition-colors`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${stock.Ticker}-${column.field}`}
                      className={`${column.width} px-6 py-4 text-sm whitespace-nowrap`}
                    >
                      {typeof stock[column.field] === 'number'
                        ? Number(stock[column.field]).toFixed(2)
                        : stock[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <SaveQueryModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveQuery}
        currentQuery={currentQuery}
        initialName={queryName}
        initialDescription={queryDescription}
      />

      <ManageColumnsModal
        isOpen={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
        columns={columns}
        onSave={handleSaveColumns}
        onReset={handleResetColumns}
      />
    </Card>
  );
}