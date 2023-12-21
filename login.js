const fs = require('fs');
const puppeteer = require('puppeteer');
const { Client } = require('ssh2');

(async () => {
  try {
    const accountsJson = JSON.parse(process.env.ACCOUNTS_JSON);

    for (const account of accountsJson) {
      const { username, password } = account;

      // 建立SSH连接
      const ssh = new Client();
      await new Promise((resolve, reject) => {
        ssh.on('ready', resolve).on('error', reject).connect({
          host: 'ssh-dsk.alwaysdata.net',
          port: 22,
          username,
          password,
        });
      });

      // 执行SSH相关的命令或其他任务
      console.log(`账号 ${username} 使用SSH登录成功！`);

      // 关闭SSH连接
      ssh.end();
    }

    console.log('所有账号登录完成！');
  } catch (error) {
    console.error(`读取 accounts.json 文件时出现错误: ${error}`);
  }
})();
