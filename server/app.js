const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // 跨域支持
const indexRouter = require('./routes/index'); // 动态加载路由文件

const mongoose = require('mongoose'); // mongodb

// .env 配置
require('dotenv').config();

const app = express();

// 跨域配置
app.use(cors());

//connect to the database
console.log("---------------------------------");
console.log("Connecting to the database...");
mongoose.connect(process.env.MongoDB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connect error'));
db.once('open', function () {
    console.log("Database connect successfully!");
    console.log("---------------------------------");

});


// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中间件配置
app.use(logger('dev')); // 日志输出
app.use(express.json()); // JSON 请求体解析
app.use(express.urlencoded({ extended: false })); // URL 编码解析
app.use(cookieParser()); // 处理 Cookies
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件服务

// 挂载路由
app.use('/', indexRouter);

// 捕获 404 错误并转发到错误处理器
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理器
app.use(function (err, req, res, next) {
  // 设置本地变量，仅在开发环境提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
