const { chromium } = require('playwright');

async function getInstagramToken() {
  const username = process.env.IG_USERNAME;
  const password = process.env.IG_PASSWORD;

  if (!username || !password) {
    console.error('Error: IG_USERNAME and IG_PASSWORD environment variables must be set.');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to Instagram login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle' });

    // Accept cookies if prompted
    const cookieBtn = page.locator('button:has-text("Allow"), button:has-text("Accept")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
    }

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Extract cookies and localStorage tokens
    const cookies = await context.cookies();
    const sessionid = cookies.find(c => c.name === 'sessionid');
    const csrftoken = cookies.find(c => c.name === 'csrftoken');
    const ds_user_id = cookies.find(c => c.name === 'ds_user_id');

    // Try to get access token from localStorage or page JS
    const accessToken = await page.evaluate(() => {
      try {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          const val = localStorage.getItem(key);
          if (val && val.includes('access_token')) {
            return val;
          }
        }
        // Check window._sharedData
        if (window._sharedData) {
          return JSON.stringify(window._sharedData);
        }
      } catch (e) {}
      return null;
    });

    console.log('\n=== Instagram Session Tokens ===');
    if (sessionid) console.log(`sessionid:   [REDACTED - ${sessionid.value.length} chars]`);
    if (csrftoken)  console.log(`csrftoken:   [REDACTED - ${csrftoken.value.length} chars]`);
    if (ds_user_id) console.log(`ds_user_id:  ${ds_user_id.value}`);
    // Write tokens to a local file instead of printing to stdout/logs
    const fs = require('fs');
    const out = { sessionid: sessionid?.value, csrftoken: csrftoken?.value, ds_user_id: ds_user_id?.value };
    fs.writeFileSync('/tmp/ig_tokens.json', JSON.stringify(out, null, 2), { mode: 0o600 });
    console.log('\nTokens written to /tmp/ig_tokens.json (mode 600, not printed to stdout)');

    if (!sessionid) {
      console.log('\nLogin may have failed or 2FA is required. Current URL:', page.url());
      console.log('All cookies:', JSON.stringify(cookies.map(c => ({ name: c.name, value: c.value })), null, 2));
    }

  } finally {
    await browser.close();
  }
}

getInstagramToken().catch(console.error);
