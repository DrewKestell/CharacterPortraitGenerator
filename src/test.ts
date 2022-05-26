import playwright from 'playwright';

async function main() {
  console.log('Running tests..')
  const browser = await playwright.firefox.launch({
    headless: false
  });
  const page = await browser.newPage()
  await page.goto('https://bot.sannysoft.com')
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'testresult.png', fullPage: true })
  await browser.close()
  console.log(`All done, check the screenshot. ✨`)
}

main();