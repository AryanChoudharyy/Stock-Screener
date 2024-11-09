export interface Stock {
  Ticker: string;
  'Market Capitalization (B)': number;
  'P/E Ratio': number;
  'ROE (%)': number;
  'Debt-to-Equity Ratio': number;
  'Dividend Yield (%)': number;
  'Revenue Growth (%)': number;
  'EPS Growth (%)': number;
  'Current Ratio': number;
  'Gross Margin (%)': number;
}

export type QueryOperator = '>' | '<' | '=' | '>=' | '<='

export interface QueryCondition {
  field: keyof Stock;
  operator: QueryOperator;
  value: number;
}

export interface ParsedQuery {
  conditions: QueryCondition[];
  isValid: boolean;
  error?: string;
}

export interface SortConfig {
  field: keyof Stock | null;
  direction: 'asc' | 'desc';
}

export type PageSize = 10 | 25 | 50;

export interface ColumnConfig {
  field: keyof Stock;
  label: string;
  width: string;
}