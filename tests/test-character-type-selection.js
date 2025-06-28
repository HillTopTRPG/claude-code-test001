/**
 * Test Plan自動実行スクリプト for キャラクター種別選択とメインビジュアル表示機能
 * 
 * Test Plan項目:
 * 1. キャラクター種別選択UIが正常に表示されることを確認
 * 2. 各種別（ドール/サヴァント/ホラー/レギオン）の選択が可能であることを確認
 * 3. ドール選択時にポジション画像が正しく表示されることを確認
 * 4. サヴァント/ホラー/レギオン選択時に種別画像が正しく表示されることを確認
 * 5. メインビジュアルエリアの表示が適切であることを確認
 * 6. ポジション・クラス系マニューバのアイコンが正しく表示されることを確認
 */

import { test, expect } from '@playwright/test';

// テスト用のキャラクターデータURL
const TEST_CHARACTER_URL = 'https://charasheet.vampire-blood.net/5132265';

test.describe('キャラクター種別選択機能テスト', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/systems/nechronica');
    await page.screenshot({ path: 'test-results/character-type-01-page-loaded.png' });
  });

  test('1. キャラクター種別選択UIが正常に表示されることを確認', async () => {
    // キャラクター種別選択UIの存在確認
    const typeSelectLabel = page.locator('h5:has-text("キャラクター種別")');
    await expect(typeSelectLabel).toBeVisible();
    
    const typeSelect = page.locator('.ant-select').filter({ hasText: 'ドール' });
    await expect(typeSelect).toBeVisible();
    await page.screenshot({ path: 'test-results/character-type-02-ui-visible.png' });
    
    // デフォルトで「ドール」が選択されていることを確認
    await expect(typeSelect).toHaveText(/ドール/);
  });

  test('2. 各種別（ドール/サヴァント/ホラー/レギオン）の選択が可能であることを確認', async () => {
    const typeSelect = page.locator('.ant-select').filter({ hasText: 'ドール' });
    
    // 選択肢を開く
    await typeSelect.click();
    await page.screenshot({ path: 'test-results/character-type-03-options-opened.png' });
    
    // 各選択肢が存在することを確認
    const dollOption = page.locator('.ant-select-item-option-content:has-text("ドール")');
    const savantOption = page.locator('.ant-select-item-option-content:has-text("サヴァント")');
    const horrorOption = page.locator('.ant-select-item-option-content:has-text("ホラー")');
    const legionOption = page.locator('.ant-select-item-option-content:has-text("レギオン")');
    
    await expect(dollOption).toBeVisible();
    await expect(savantOption).toBeVisible();
    await expect(horrorOption).toBeVisible();
    await expect(legionOption).toBeVisible();
    
    // サヴァントを選択
    await savantOption.click();
    await page.screenshot({ path: 'test-results/character-type-04-savant-selected.png' });
    await expect(typeSelect).toHaveText(/サヴァント/);
    
    // ホラーを選択
    await typeSelect.click();
    await horrorOption.click();
    await page.screenshot({ path: 'test-results/character-type-05-horror-selected.png' });
    await expect(typeSelect).toHaveText(/ホラー/);
    
    // レギオンを選択
    await typeSelect.click();
    await legionOption.click();
    await page.screenshot({ path: 'test-results/character-type-06-legion-selected.png' });
    await expect(typeSelect).toHaveText(/レギオン/);
    
    // ドールに戻す
    await typeSelect.click();
    await dollOption.click();
    await page.screenshot({ path: 'test-results/character-type-07-doll-reselected.png' });
    await expect(typeSelect).toHaveText(/ドール/);
  });

  test('3. ドール選択時のキャラクター読み込みとメインビジュアル表示を確認', async () => {
    // ドールが選択されていることを確認
    const typeSelect = page.locator('.ant-select').filter({ hasText: 'ドール' });
    await expect(typeSelect).toHaveText(/ドール/);
    await page.screenshot({ path: 'test-results/character-type-08-before-load-doll.png' });
    
    // キャラクターURLを入力
    const inputField = page.locator('input[placeholder*="https://charasheet.vampire-blood.net"]');
    await inputField.fill(TEST_CHARACTER_URL);
    await page.screenshot({ path: 'test-results/character-type-09-url-entered-doll.png' });
    
    // 取得ボタンをクリック
    await page.click('button:has-text("取得")');
    await page.screenshot({ path: 'test-results/character-type-10-fetch-clicked-doll.png' });
    
    // キャラクターデータの読み込み完了を待機
    await page.waitForSelector('img[alt*="キャラクター"]', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/character-type-11-doll-loaded.png' });
    
    // メインビジュアル画像が表示されることを確認
    const mainVisual = page.locator('img[alt*="キャラクター"]').first();
    await expect(mainVisual).toBeVisible();
    
    // 種別タグが表示されることを確認
    const typeTag = page.locator('.ant-tag:has-text("ドール")');
    await expect(typeTag).toBeVisible();
    
    // ポジション画像が表示されていることを確認（src属性をチェック）
    const mainVisualSrc = await mainVisual.getAttribute('src');
    expect(mainVisualSrc).toContain('position/');
  });

  test('4. サヴァント選択時のキャラクター読み込みとメインビジュアル表示を確認', async () => {
    // 新しいキャラクターを表示ボタンをクリックしてリセット
    const resetButton = page.locator('button:has-text("新しいキャラクターを表示")');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.screenshot({ path: 'test-results/character-type-12-reset-for-savant.png' });
    }
    
    // サヴァントを選択
    const typeSelect = page.locator('.ant-select').first();
    await typeSelect.click();
    const savantOption = page.locator('.ant-select-item-option-content:has-text("サヴァント")');
    await savantOption.click();
    await page.screenshot({ path: 'test-results/character-type-13-savant-selected-for-load.png' });
    
    // キャラクターURLを入力
    const inputField = page.locator('input[placeholder*="https://charasheet.vampire-blood.net"]');
    await inputField.fill(TEST_CHARACTER_URL);
    await page.screenshot({ path: 'test-results/character-type-14-url-entered-savant.png' });
    
    // 取得ボタンをクリック
    await page.click('button:has-text("取得")');
    
    // キャラクターデータの読み込み完了を待機
    await page.waitForSelector('img[alt*="キャラクター"]', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/character-type-15-savant-loaded.png' });
    
    // メインビジュアル画像が表示されることを確認
    const mainVisual = page.locator('img[alt*="キャラクター"]').first();
    await expect(mainVisual).toBeVisible();
    
    // 種別タグが表示されることを確認
    const typeTag = page.locator('.ant-tag:has-text("サヴァント")');
    await expect(typeTag).toBeVisible();
    
    // 種別画像が表示されていることを確認（src属性をチェック）
    const mainVisualSrc = await mainVisual.getAttribute('src');
    expect(mainVisualSrc).toContain('type/savant');
  });

  test('5. ホラー選択時のキャラクター読み込みとメインビジュアル表示を確認', async () => {
    // 新しいキャラクターを表示ボタンをクリックしてリセット
    const resetButton = page.locator('button:has-text("新しいキャラクターを表示")');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.screenshot({ path: 'test-results/character-type-16-reset-for-horror.png' });
    }
    
    // ホラーを選択
    const typeSelect = page.locator('.ant-select').first();
    await typeSelect.click();
    const horrorOption = page.locator('.ant-select-item-option-content:has-text("ホラー")');
    await horrorOption.click();
    await page.screenshot({ path: 'test-results/character-type-17-horror-selected-for-load.png' });
    
    // キャラクターURLを入力
    const inputField = page.locator('input[placeholder*="https://charasheet.vampire-blood.net"]');
    await inputField.fill(TEST_CHARACTER_URL);
    await page.screenshot({ path: 'test-results/character-type-18-url-entered-horror.png' });
    
    // 取得ボタンをクリック
    await page.click('button:has-text("取得")');
    
    // キャラクターデータの読み込み完了を待機
    await page.waitForSelector('img[alt*="キャラクター"]', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/character-type-19-horror-loaded.png' });
    
    // メインビジュアル画像が表示されることを確認
    const mainVisual = page.locator('img[alt*="キャラクター"]').first();
    await expect(mainVisual).toBeVisible();
    
    // 種別タグが表示されることを確認
    const typeTag = page.locator('.ant-tag:has-text("ホラー")');
    await expect(typeTag).toBeVisible();
    
    // 種別画像が表示されていることを確認（src属性をチェック）
    const mainVisualSrc = await mainVisual.getAttribute('src');
    expect(mainVisualSrc).toContain('type/horror');
  });

  test('6. レギオン選択時のキャラクター読み込みとメインビジュアル表示を確認', async () => {
    // 新しいキャラクターを表示ボタンをクリックしてリセット
    const resetButton = page.locator('button:has-text("新しいキャラクターを表示")');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.screenshot({ path: 'test-results/character-type-20-reset-for-legion.png' });
    }
    
    // レギオンを選択
    const typeSelect = page.locator('.ant-select').first();
    await typeSelect.click();
    const legionOption = page.locator('.ant-select-item-option-content:has-text("レギオン")');
    await legionOption.click();
    await page.screenshot({ path: 'test-results/character-type-21-legion-selected-for-load.png' });
    
    // キャラクターURLを入力
    const inputField = page.locator('input[placeholder*="https://charasheet.vampire-blood.net"]');
    await inputField.fill(TEST_CHARACTER_URL);
    await page.screenshot({ path: 'test-results/character-type-22-url-entered-legion.png' });
    
    // 取得ボタンをクリック
    await page.click('button:has-text("取得")');
    
    // キャラクターデータの読み込み完了を待機
    await page.waitForSelector('img[alt*="キャラクター"]', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/character-type-23-legion-loaded.png' });
    
    // メインビジュアル画像が表示されることを確認
    const mainVisual = page.locator('img[alt*="キャラクター"]').first();
    await expect(mainVisual).toBeVisible();
    
    // 種別タグが表示されることを確認
    const typeTag = page.locator('.ant-tag:has-text("レギオン")');
    await expect(typeTag).toBeVisible();
    
    // 種別画像が表示されていることを確認（src属性をチェック）
    const mainVisualSrc = await mainVisual.getAttribute('src');
    expect(mainVisualSrc).toContain('type/legion');
  });

  test('7. ドールのポジション・クラス系マニューバアイコンが正しく表示されることを確認', async () => {
    // 新しいキャラクターを表示ボタンをクリックしてリセット
    const resetButton = page.locator('button:has-text("新しいキャラクターを表示")');
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await page.screenshot({ path: 'test-results/character-type-24-reset-for-maneuver-test.png' });
    }
    
    // ドールを選択（デフォルトだが明示的に確認）
    const typeSelect = page.locator('.ant-select').first();
    await expect(typeSelect).toHaveText(/ドール/);
    
    // キャラクターURLを入力して読み込み
    const inputField = page.locator('input[placeholder*="https://charasheet.vampire-blood.net"]');
    await inputField.fill(TEST_CHARACTER_URL);
    await page.click('button:has-text("取得")');
    
    // キャラクターデータの読み込み完了を待機
    await page.waitForSelector('div[style*="width: 68px"][style*="cursor: pointer"]', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/character-type-25-doll-maneuvers-loaded.png' });
    
    // ポジションマニューバセクションの存在確認
    const positionSection = page.locator('h5:has-text("ポジション")');
    if (await positionSection.isVisible()) {
      await page.screenshot({ path: 'test-results/character-type-26-position-maneuvers.png' });
      
      // ポジションマニューバのアイコンを確認
      const positionManeuvers = page.locator('h5:has-text("ポジション")').locator('..').locator('div[style*="width: 68px"]');
      if (await positionManeuvers.first().isVisible()) {
        // ポジション系マニューバが存在する場合、画像のsrc属性を確認
        const maneuverImg = positionManeuvers.first().locator('img').first();
        const imgSrc = await maneuverImg.getAttribute('src');
        // ポジション画像またはクラス画像が使用されていることを確認
        expect(imgSrc).toMatch(/position\/|class\//);
      }
    }
    
    // メインクラスマニューバセクションの存在確認
    const mainClassSection = page.locator('h5:has-text("メインクラス")');
    if (await mainClassSection.isVisible()) {
      await page.screenshot({ path: 'test-results/character-type-27-mainclass-maneuvers.png' });
      
      // メインクラスマニューバのアイコンを確認
      const mainClassManeuvers = page.locator('h5:has-text("メインクラス")').locator('..').locator('div[style*="width: 68px"]');
      if (await mainClassManeuvers.first().isVisible()) {
        const maneuverImg = mainClassManeuvers.first().locator('img').first();
        const imgSrc = await maneuverImg.getAttribute('src');
        // クラス画像が使用されていることを確認
        expect(imgSrc).toMatch(/class\//);
      }
    }
    
    // サブクラスマニューバセクションの存在確認
    const subClassSection = page.locator('h5:has-text("サブクラス")');
    if (await subClassSection.isVisible()) {
      await page.screenshot({ path: 'test-results/character-type-28-subclass-maneuvers.png' });
      
      // サブクラスマニューバのアイコンを確認
      const subClassManeuvers = page.locator('h5:has-text("サブクラス")').locator('..').locator('div[style*="width: 68px"]');
      if (await subClassManeuvers.first().isVisible()) {
        const maneuverImg = subClassManeuvers.first().locator('img').first();
        const imgSrc = await maneuverImg.getAttribute('src');
        // クラス画像が使用されていることを確認
        expect(imgSrc).toMatch(/class\//);
      }
    }
  });

  test.afterAll(async () => {
    await page.close();
  });
});

export { test, expect };