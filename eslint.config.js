import globals from 'globals'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'error',

      // imports
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',

      // bloquear CommonJS
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='require']",
          message: 'require não permitido em projeto ESM',
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'module', message: 'CommonJS não permitido' },
        { name: 'exports', message: 'CommonJS não permitido' },
      ],
    },
  },
]
