module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@babel/eslint-parser',
  },
  rules: {},
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
}
