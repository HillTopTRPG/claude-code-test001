import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // テストディレクトリ
  testDir: '.',
  testMatch: ['test-maneuver-status.js', 'test-character-type-selection.js'],
  
  // 出力ディレクトリ
  outputDir: 'test-results',
  
  // 並列実行設定
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // レポート設定
  reporter: [
    ['html', { outputFolder: 'reports' }],
    ['json', { outputFile: 'results/results.json' }]
  ],
  
  use: {
    // ベースURL（開発サーバー）
    baseURL: 'http://localhost:5173',
    
    // トレース設定
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    
    // ブラウザ設定
    headless: true,
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 開発サーバー設定
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    cwd: '..',
  },
});