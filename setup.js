const fs = require('fs');
const path = require('path');

// Define the project structure
const structure = {
  'src': {
    'app': {
      'page.tsx': '',
      'layout.tsx': '',
      'globals.css': ''
    },
    'components': {
      'SearchQuery.tsx': '',
      'ResultsTable.tsx': '',
      'Pagination.tsx': '',
      'ui': {
        'Button.tsx': '',
        'Card.tsx': '',
        'Input.tsx': ''
      }
    },
    'types': {
      'stock.ts': ''
    },
    'utils': {
      'queryParser.ts': '',
      'stockFilter.ts': '',
      'cn.ts': ''
    }
  },
  'public': {
    'data': {
      'stocks.json': ''
    }
  }
};

// Function to create directory structure
function createDirectory(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = path.join(basePath, name);
    
    if (typeof content === 'object') {
      // If it's a directory
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      createDirectory(currentPath, content);
    } else {
      // If it's a file
      if (!fs.existsSync(currentPath)) {
        fs.writeFileSync(currentPath, '');
      }
    }
  }
}

// Create the project structure
try {
  createDirectory(process.cwd(), structure);
  console.log('Project structure created successfully!');
} catch (error) {
  console.error('Error creating project structure:', error);
}