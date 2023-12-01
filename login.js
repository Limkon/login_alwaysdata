const puppeteer = require('puppeteer');

(async () => {
  // 读取 accounts.json 文件中的 JSON 字符串
  const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
  const accounts = JSON.parse(accountsJson);

  for (const account of accounts) {
    const { username, password } = account;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
      await page.goto('https://www.alwaysdata.com/login/');

      // 等待页面加载完成
      await page.waitForTimeout(5000); // 可根据实际情况调整等待时间

      // 清空用户名和密码输入框的原有值
      const usernameInput = await page.$('#id_login');
      const passwordInput = await page.$('#id_password');
      if (usernameInput && passwordInput) {
        await usernameInput.click({ clickCount: 3 });
        await usernameInput.press('Backspace');
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.press('Backspace');
      }

      // 输入实际的用户名和密码
      await page.type('#id_login', username);
      await page.type('#id_password', password);

      // 提交登录表单
      const loginButton = await page.$('button[type="submit"]');
      if (loginButton) {
        await loginButton.click();
      } else {
        throw new Error('无法找到登录按钮');
      }

      // 等待登录成功（如果有跳转页面的话）
      await page.waitForNavigation();

      // 判断是否登录成功
      const isLoggedIn = await page.evaluate(() => {
        // 这里根据实际情况修改判断条件，例如检查登录后的页面元素
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
      // 关闭页面和浏览器
      await page.close();
      await browser.close();

      // 用户之间添加随机延时
      const delay = Math.floor(Math.random() * 5000) + 1000; // 随机延时1秒到6秒之间
      await delayTime(delay);
    }
  }

  console.log('所有账号登录完成！');
})();

// 自定义延时函数
function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
