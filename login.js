const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  let browser;  // 将 browser 对象定义在循环外部

  try {
    // 读取 accounts.json 文件中的 JSON 字符串
    const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
    const accounts = JSON.parse(accountsJson);

    browser = await puppeteer.launch({ headless: false });

    for (const account of accounts) {
      const { username, password } = account;
      const page = await browser.newPage();

      try {
        await page.goto('https://www.alwaysdata.com/login/', { waitUntil: 'load' });

        // 等待页面加载完成
        await page.waitForSelector('#id_login', { timeout: 30000 }).catch(error => console.error(error));

        // 其余部分保持不变
        // ...

      } catch (error) {
        console.error(`账号 ${username} 登录时出现错误: ${error}`);
      } finally {
        // 关闭页面
        await page.close();
      }
    }

    console.log('所有账号登录完成！');
  } catch (error) {
    console.error(`读取 accounts.json 文件时出现错误: ${error}`);
  } finally {
    // 关闭浏览器
    if (browser) {
      await browser.close();
    }
  }
})();
