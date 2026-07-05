import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ResourceLoader } from '@angular/compiler';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// Filesystem ResourceLoader for Vitest/JSDOM.
// Angular JIT passes relative templateUrl (e.g. './app.component.html')
// without directory context, so we scan src/ to locate the file.
class FsResourceLoader extends ResourceLoader {
  private readonly codegen = resolve(process.cwd(), 'src');

  override get(url: string): Promise<string> {
    // url is a relative path like './app.component.html' or './app.component.css'
    // Scan src/ recursively to find the file by its basename
    const basename = url.replace(/^\.\//, '');
    const found = this.findFile(this.codegen, basename);
    if (!found) {
      return Promise.reject(`Template not found: ${url}`);
    }
    try {
      return Promise.resolve(readFileSync(found, 'utf-8'));
    } catch (err: any) {
      return Promise.reject(`Failed to read template: ${found}\n${err.message}`);
    }
  }

  private findFile(dir: string, basename: string): string | null {
    // Simple BFS for first match
    const queue: string[] = [dir];
    const seen = new Set<string>();
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      try {
        const entries = readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
          const full = resolve(current, entry.name);
          if (entry.name === 'node_modules') continue;
          if (entry.name === '.git') continue;
          if (entry.name === basename) return full;
          if (entry.isDirectory()) queue.push(full);
        }
      } catch {
        // Skip unreadable dirs
      }
    }
    return null;
  }
}

const tb = getTestBed();
tb.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
tb.configureCompiler({
  providers: [{ provide: ResourceLoader, useClass: FsResourceLoader }],
});