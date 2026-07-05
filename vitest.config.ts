import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

function rxjsResolver(): Plugin {
  const RXJS_DIRECTORY_IMPORTS: Record<string, string> = {
    'rxjs/operators': 'rxjs/operators/index.js',
    'rxjs/testing': 'rxjs/testing/index.js',
    'rxjs/ajax': 'rxjs/ajax/index.js',
    'rxjs/webSocket': 'rxjs/webSocket/index.js',
    'rxjs/fetch': 'rxjs/fetch/index.js',
  };

  return {
    name: 'rxjs-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source in RXJS_DIRECTORY_IMPORTS) {
        return path.resolve(process.cwd(), 'node_modules', RXJS_DIRECTORY_IMPORTS[source]);
      }
      return null;
    },
  };
}

function angularHtmlLoader(): Plugin {
  return {
    name: 'angular-html-loader',
    transform(code, id) {
      if (id.endsWith('.html')) {
        const content = fs.readFileSync(id, 'utf-8');
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [rxjsResolver(), angularHtmlLoader()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    server: {
      deps: {
        inline: ['@angular/core', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/common', '@angular/router', '@angular/forms', 'rxjs'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/sporteam-frontend',
    },
  },
});