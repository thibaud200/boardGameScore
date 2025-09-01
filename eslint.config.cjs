const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')

const prettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  bracketSpacing: true,
  semi: false,
  useTabs: false,
  bracketSameLine: false,
  proseWrap: 'never'
}

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': ['error', prettierConfig]
    }
  }
]
