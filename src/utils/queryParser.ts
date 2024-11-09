import { ParsedQuery, QueryCondition, Stock } from '@/types/stock';

const fieldMappings: Record<string, keyof Stock> = {
  'Market Capitalization': 'Market Capitalization (B)',
  'Market Cap': 'Market Capitalization (B)',
  'P/E Ratio': 'P/E Ratio',
  'PE Ratio': 'P/E Ratio',
  'PE': 'P/E Ratio',
  'ROE': 'ROE (%)',
  'Return on Equity': 'ROE (%)',
  'Debt-to-Equity Ratio': 'Debt-to-Equity Ratio',
  'D/E Ratio': 'Debt-to-Equity Ratio',
  'Dividend Yield': 'Dividend Yield (%)',
  'Revenue Growth': 'Revenue Growth (%)',
  'EPS Growth': 'EPS Growth (%)',
  'Current Ratio': 'Current Ratio',
  'Gross Margin': 'Gross Margin (%)'
};

export function parseQuery(queryString: string): ParsedQuery {
  try {
    if (!queryString.trim()) {
      return { conditions: [], isValid: false, error: 'Query cannot be empty' };
    }

    const lines = queryString
      .split('AND')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const conditions: QueryCondition[] = lines.map(line => {
      // Match pattern: field operator value
      const match = line.match(/^(.*?)\s*([><]=?|=|<|>)\s*(-?\d+\.?\d*)$/);
      if (!match) {
        throw new Error(`Invalid condition format: ${line}`);
      }

      const [, fieldRaw, operator, valueStr] = match;
      const field = fieldMappings[fieldRaw.trim()];
      
      if (!field) {
        throw new Error(`Invalid field: ${fieldRaw}. Available fields are: ${Object.keys(fieldMappings).join(', ')}`);
      }

      return {
        field,
        operator: operator as QueryCondition['operator'],
        value: parseFloat(valueStr),
      };
    });

    return {
      conditions,
      isValid: true,
    };
  } catch (error) {
    return {
      conditions: [],
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid query format',
    };
  }
}