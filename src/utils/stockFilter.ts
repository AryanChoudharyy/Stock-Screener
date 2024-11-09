import { QueryCondition, Stock, SortConfig } from '@/types/stock';

export function filterStocks(stocks: Stock[], conditions: QueryCondition[]): Stock[] {
  console.log('Filtering stocks with conditions:', conditions); // Debug log

  return stocks.filter(stock => 
    conditions.every(condition => {
      const value = stock[condition.field];
      console.log(`Checking ${stock.Ticker}: ${condition.field} = ${value} ${condition.operator} ${condition.value}`); // Debug log
      
      switch (condition.operator) {
        case '>':
          return Number(value) > condition.value;
        case '<':
          return Number(value) < condition.value;
        case '>=':
          return Number(value) >= condition.value;
        case '<=':
          return Number(value) <= condition.value;
        case '=':
          return Number(value) === condition.value;
        default:
          return false;
      }
    })
  );
}

export function sortStocks(stocks: Stock[], sortConfig: SortConfig): Stock[] {
  if (!sortConfig.field) return stocks;

  return [...stocks].sort((a, b) => {
    const aValue = Number(a[sortConfig.field!]);
    const bValue = Number(b[sortConfig.field!]);
    
    const sortMultiplier = sortConfig.direction === 'asc' ? 1 : -1;
    return (aValue - bValue) * sortMultiplier;
  });
}

export function paginateStocks(stocks: Stock[], page: number, pageSize: number): Stock[] {
  const start = (page - 1) * pageSize;
  return stocks.slice(start, start + pageSize);
}