const fs = require('fs').promises; // 使用 fs.promises 以支持异步文件读取
const puppeteer = require('puppeteer');

(async () => {
  try {
    // 读取 accounts.json 文件中的 JSON 字符串
    const accountsJson = await fs.readFile('accounts.json', 'utf-8');
    const accounts = JSON.parse(accountsJson);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const account of accounts) {
      const { username, password } = account;

      try {
        await page.goto('https://www.alwaysdata.com/login/');

        // 等待页面加载完成
        await page.waitForSelector('#id_login');

        // 输入用户名和密码
        await page.type('#id_login', username);
        await page.type('#id_password', password);

        // 提交登录表单
        await page.click('button[type="submit"]');

        // 等待登录成功（如果有跳转页面的话）
        await page.waitForNavigation();

        // 判断是否登录成功，这里可以根据实际情况修改判断条件
        const isLoggedIn = await page.$('.success-element') !== null;

        if (isLoggedIn) {
          console.log(`账号 ${username} 登录成功！`);
        } else {
          console.error(`账号 ${username} 登录失败，请检查账号和密码是否正确。`);
        }
      } catch (error) {
        console.error(`账号 ${username} 登录时出现错误: ${error}`);
      } finally {
        // 关闭页面
        await page.close();

        // 用户之间添加随机延时
        const delay = Math.floor(Math.random() * 5000) + 1000; // 随机延时1秒到6秒之间
        await delayTime(delay);
      }
    }

    console.log('所有账号登录完成！');
  } catch (error) {
    console.error(`读取 accounts.json 文件时出现错误: ${error}`);
  }
  finally {
    // 关闭浏览器
    await browser.close();
  }
})();

// 自定义延时函数
function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
