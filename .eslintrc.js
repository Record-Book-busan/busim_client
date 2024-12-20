module.exports = {
  root: true,
  plugins: ['import', 'react'],
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['plugins/**/*', 'metro.config.js', 'commitlint.config.js', 'tailwind.config.js'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: '.',
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.{ts,tsx}'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
      typescript: { alwaysTryTypes: true },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'global-require': 0,
    'react-hooks/exhaustive-deps': 'off',
    'react/require-default-props': 'off',
    'react/default-props-match-prop-types': ['error'],
    'react/sort-prop-types': ['error'],
    'react/no-array-index-key': 'off',
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/jsx-handler-names': [
      'warn',
      {
        eventHandlerPrefix: '(on|handle)',
        eventHandlerPropPrefix: '(on|handle)',
        checkLocalVariables: true,
        checkInlineFunction: false,
      },
    ],
    'react-native/no-inline-styles': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-void': 'off',
    'no-console': 'off',
    'no-shadow': 'warn',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '(React|^_)' },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { variables: false, functions: false, classes: false },
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-require-imports': 'warn',
  },
}
