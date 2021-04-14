module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    // 'prettier/vue',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    // 'prettier' // ←削除
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}