// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        jquery: true,
    },
    extends: ['eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser:'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
    },
    plugins: ['babel'],
    rules: {
        'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
        quotes: ['error', 'single', { avoidEscape: true }],
        'no-var': 1,
        'prefer-const': 1,
    },
};
