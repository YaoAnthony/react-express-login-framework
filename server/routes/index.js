const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 自动加载路由文件
const routeFiles = fs.readdirSync(__dirname).filter((file) => {
  return file !== 'index.js' && file.endsWith('.js');
});

routeFiles.forEach((file) => {
  const route = require(path.join(__dirname, file));
  const routeName = `/${file.replace('.js', '')}`; // 用文件名生成路由前缀
  console.log(`Loading route: ${routeName}`);
  router.use(routeName, route);
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
