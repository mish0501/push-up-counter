// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Custom rules
    semi: ['error', 'never'],
    'no-console': [
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
      {
        allow: ['log', 'clear'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'max-len': ['error', 80],
    'no-shadow': 'off',
    'array-callback-return': 'off',
    'prefer-rest-params': 'off',
    'no-underscore-dangle': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
