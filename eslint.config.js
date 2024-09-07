// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.vue'],
    // @ts-expect-error pluginVue has incompatible type for sourceType
    extends: [...tseslint.configs.recommendedTypeChecked, ...pluginVue.configs['flat/recommended']],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern:
            '^_|ctx|pageContext|err|res|rej|resolve|reject|resp|req|response|reply|request|evt|event|cb|callback',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/require-toggle-inside-transition': 'off',
      'vue/no-lone-template': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
  configPrettier,
  {
    ignores: [
      '*.min.*',
      '*.d.ts',
      'CHANGELOG.md',
      'dist',
      'LICENSE*',
      'output',
      'coverage',
      'public',
      'temp',
      'packages-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      '.yarn',
      '.pnp.*',
      '__snapshots__',
      '!.github',
      '!.vitepress',
      '!.vscode',
    ],
  },
)
