const { defineConfig } = require('eslint-define-config');
const globals = require('globals');

module.exports = defineConfig({
    languageOptions: {
        globals: {
            ...globals.browser, // Add browser globals if needed
            process: true,      // Add Node.js globals
            __dirname: true,    // Add more globals as needed
            module: true        // For Node.js modules
        },
        parserOptions: {
            ecmaVersion: 2021,  // Specify ECMAScript version (2021 / ES12)
            sourceType: 'module' // Allow the use of `import/export`
        }
    },
    rules: {
        'semi': ['error', 'always'],                   // Enforce semicolons at the end of statements
        'quotes': ['error', 'single'],                 // Enforce the use of single quotes for strings
        'no-console': 'off',                           // Allow the use of `console` statements
        'indent': ['error', 4],                        // Enforce 4-space indentation
        'no-unused-vars': ['warn'],                    // Warn when variables are defined but not used
        'eqeqeq': ['error', 'always'],                 // Enforce strict equality checks (=== and !==)
        'comma-dangle': ['error', 'never'],            // Disallow trailing commas
        'arrow-parens': ['error', 'always'],           // Require parentheses in arrow function arguments
        'no-multiple-empty-lines': ['error', { max: 1 }], // Limit multiple empty lines to 1
        'eol-last': ['error', 'always']               // Require a newline at the end of files
    }
});
