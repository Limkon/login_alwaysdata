const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  let browser;

  try {
    const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
    const accounts = JSON.parse(accountsJson);

    browser = await puppeteer.launch({ headless: false });

    for (const account of accounts) {
      const { username, password } = account;
      const page = await browser.newPage();

      try {
        await page.goto('https://www.alwaysdata.com/login/', { waitUntil: 'load' });
        await page.waitForSelector('#id_login', { timeout: 30000 }).catch(error => console.error(error));

        const usernameInput = await page.$('#id_login');
        const passwordInput = await page.$('#id_password');

        if (usernameInput && passwordInput) {
          await usernameInput.click({ clickCount: 3 });
          await usernameInput.press('Backspace');
          await passwordInput.click({ clickCount: 3 });
          await passwordInput.press('Backspace');
        }

        await page.type('#id_login', username);
        await page.type('#id_password', password);

        const loginButton = await page.$('button[type="submit"]');
        if (loginButton) {
          await loginButton.click();
        } else {
          throw new Error('无法找到登录按钮');
        }

        await page.waitForNavigation();
        const isLoggedIn = await page.evaluate(() => {
          const successElement = document.querySelector('.success-element');
          return successElement !== null;
        });

        if (isLoggedIn) {
          console.log(`账号 ${username} 登录成功！`);
        } else {
          console.error(`账号 ${username} 登录失败，请检查账号和密码是否正确。`);
        }
      } catch (error) {
        console.error(`账号 ${username} 登录时出现错误: ${error}`);
      } finally {
        await page.close();
      }
    }

    console.log('所有账号登录完成！');
  } catch (error) {
    console.error(`读取 accounts.json 文件时出现错误: ${error}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
