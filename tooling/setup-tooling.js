#!/usr/bin/env node

/**
 * SkyScout AI Tooling Setup Script
 * Initializes the complete development environment with best practices
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ToolingSetup {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async initialize() {
    console.log('🚀 Initializing SkyScout AI Development Tooling...\n');

    const steps = [
      { name: 'Installing Dependencies', fn: this.installDependencies },
      { name: 'Setting up Git Hooks', fn: this.setupGitHooks },
      { name: 'Configuring ESLint', fn: this.configureESLint },
      { name: 'Setting up Prettier', fn: this.configurePrettier },
      { name: 'Configuring TypeScript', fn: this.configureTypeScript },
      { name: 'Setting up Husky', fn: this.setupHusky },
      {
        name: 'Initializing Performance Monitoring',
        fn: this.setupPerformanceMonitoring,
      },
      {
        name: 'Setting up Architecture Validation',
        fn: this.setupArchitectureValidation,
      },
      { name: 'Creating NPM Scripts', fn: this.createNPMScripts },
      { name: 'Setting up VS Code Configuration', fn: this.setupVSCodeConfig },
    ];

    for (const step of steps) {
      console.log(`📦 ${step.name}...`);
      try {
        await step.fn.call(this);
        console.log(`✅ ${step.name} completed\n`);
      } catch (error) {
        console.error(`❌ ${step.name} failed:`, error.message);
        console.log('');
      }
    }

    console.log('🎉 SkyScout AI tooling setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run `npm run dev` to start the development environment');
    console.log(
      '2. Run `npm run generate:component -- --name YourComponent --type ui` to generate components'
    );
    console.log(
      '3. Run `npm run validate:architecture` to check architectural compliance'
    );
    console.log('4. Run `npm run perf:analyze` to analyze bundle performance');
  }

  async installDependencies() {
    const devDependencies = [
      // Code quality
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-import',
      'prettier',

      // Git hooks
      'husky',
      'lint-staged',

      // Testing
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
      'jest',
      'jest-environment-jsdom',

      // Development tools
      'chokidar',
      'ws',
      'concurrently',
      'nodemon',

      // Performance monitoring
      'lighthouse',
      'bundlesize',
      'webpack-bundle-analyzer',

      // Architecture validation
      'madge',
      'dependency-cruiser',
    ];

    console.log('Installing development dependencies...');
    execSync(`npm install --save-dev ${devDependencies.join(' ')}`, {
      stdio: 'inherit',
    });
  }

  async setupGitHooks() {
    // Initialize Husky
    execSync('npx husky init', { stdio: 'inherit' });

    // Create pre-commit hook
    const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run pre-commit hooks
node tooling/automation/pre-commit-hooks.js run
`;

    fs.writeFileSync('.husky/pre-commit', preCommitHook, { mode: 0o755 });
  }

  async configureESLint() {
    const eslintConfig = {
      root: true,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        // TypeScript
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/prefer-const': 'error',

        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',

        // Import organization
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],

        // General
        'no-console': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
      },
      settings: {
        react: {
          version: 'detect',
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
          },
        },
      },
      env: {
        browser: true,
        node: true,
        es2022: true,
      },
    };

    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
  }

  async configurePrettier() {
    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'avoid',
      endOfLine: 'lf',
    };

    fs.writeFileSync(
      '.prettierrc.json',
      JSON.stringify(prettierConfig, null, 2)
    );

    const prettierIgnore = `
# Dependencies
node_modules/

# Build outputs
dist/
build/
.next/
coverage/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Generated files
*.generated.*
*.auto.*
`;

    fs.writeFileSync('.prettierignore', prettierIgnore.trim());
  }

  async configureTypeScript() {
    // TypeScript configuration is already handled by tsconfig.base.json
    // Just ensure strict mode is enabled
    console.log('TypeScript configuration already optimized');
  }

  async setupHusky() {
    // Create lint-staged configuration
    const lintStagedConfig = {
      '*.{ts,tsx}': ['eslint --fix', 'prettier --write', 'npm run type-check'],
      '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
      '*.{json,md,yml,yaml}': ['prettier --write'],
    };

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson['lint-staged'] = lintStagedConfig;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async setupPerformanceMonitoring() {
    const bundlesizeConfig = [
      {
        path: './apps/web/.next/static/**/*.js',
        maxSize: '250kb',
      },
      {
        path: './apps/web/.next/static/**/*.css',
        maxSize: '50kb',
      },
    ];

    fs.writeFileSync(
      '.bundlesizerc.json',
      JSON.stringify(bundlesizeConfig, null, 2)
    );
  }

  async setupArchitectureValidation() {
    const dependencyCruiserConfig = {
      forbidden: [
        {
          name: 'no-circular',
          severity: 'error',
          comment: 'Circular dependencies are not allowed',
          from: {},
          to: {
            circular: true,
          },
        },
        {
          name: 'no-orphans',
          severity: 'warn',
          comment: 'Orphan modules should be avoided',
          from: {
            orphan: true,
            pathNot: '\\.(d\\.ts|test|spec)$',
          },
          to: {},
        },
      ],
      options: {
        doNotFollow: {
          path: 'node_modules',
        },
        tsPreCompilationDeps: true,
        tsConfig: {
          fileName: 'tsconfig.json',
        },
      },
    };

    fs.writeFileSync(
      '.dependency-cruiser.json',
      JSON.stringify(dependencyCruiserConfig, null, 2)
    );
  }

  async createNPMScripts() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const newScripts = {
      // Development
      'dev:tooling': 'node tooling/development-tooling.js',
      'dev:all': 'concurrently "npm run dev" "npm run dev:tooling"',

      // Code quality
      lint: 'eslint . --ext .ts,.tsx,.js,.jsx',
      'lint:fix': 'eslint . --ext .ts,.tsx,.js,.jsx --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      'type-check': 'tsc --noEmit',

      // Testing
      'test:staged': 'jest --findRelatedTests',
      'test:coverage': 'jest --coverage',

      // Code generation
      'generate:component': 'node tooling/generators/component-cli.js',
      'generate:service': 'node tooling/generators/service-cli.js',

      // Architecture validation
      'validate:architecture':
        'depcruise --validate .dependency-cruiser.json src',
      'validate:imports': 'madge --circular --extensions ts,tsx .',
      'validate:naming': 'node tooling/validators/naming-conventions.js',

      // Performance
      'perf:analyze': 'npm run build && bundlesize',
      'perf:monitor': 'node tooling/automation/performance-monitor.js',
      'perf:lighthouse':
        'lighthouse http://localhost:3000 --output json --output-path lighthouse-report.json',

      // Tooling setup
      'setup:tooling': 'node tooling/setup-tooling.js',
      'setup:hooks': 'node tooling/automation/pre-commit-hooks.js install',
    };

    packageJson.scripts = { ...packageJson.scripts, ...newScripts };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async setupVSCodeConfig() {
    const vscodeDir = path.join(this.projectRoot, '.vscode');
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }

    // Settings
    const settings = {
      'typescript.preferences.importModuleSpecifier': 'relative',
      'editor.formatOnSave': true,
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true,
        'source.organizeImports': true,
      },
      'typescript.suggest.autoImports': true,
      'typescript.updateImportsOnFileMove.enabled': 'always',
      'files.associations': {
        '*.tsx': 'typescriptreact',
      },
      'emmet.includeLanguages': {
        typescriptreact: 'html',
      },
    };

    fs.writeFileSync(
      path.join(vscodeDir, 'settings.json'),
      JSON.stringify(settings, null, 2)
    );

    // Extensions
    const extensions = {
      recommendations: [
        'esbenp.prettier-vscode',
        'ms-vscode.vscode-typescript-next',
        'bradlc.vscode-tailwindcss',
        'ms-vscode.vscode-json',
        'streetsidesoftware.code-spell-checker',
        'ms-playwright.playwright',
        'ms-vscode.test-adapter-converter',
      ],
    };

    fs.writeFileSync(
      path.join(vscodeDir, 'extensions.json'),
      JSON.stringify(extensions, null, 2)
    );

    // Tasks
    const tasks = {
      version: '2.0.0',
      tasks: [
        {
          label: 'Dev: Start with Tooling',
          type: 'shell',
          command: 'npm',
          args: ['run', 'dev:all'],
          group: 'build',
          isBackground: true,
        },
        {
          label: 'Generate: Component',
          type: 'shell',
          command: 'npm',
          args: ['run', 'generate:component'],
          group: 'build',
        },
        {
          label: 'Validate: Architecture',
          type: 'shell',
          command: 'npm',
          args: ['run', 'validate:architecture'],
          group: 'test',
        },
      ],
    };

    fs.writeFileSync(
      path.join(vscodeDir, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new ToolingSetup();
  setup.initialize().catch(console.error);
}

module.exports = ToolingSetup;
