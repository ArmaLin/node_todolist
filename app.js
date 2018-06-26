

//require('./db');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');

var session = require('express-session');


// 增加一条路由规则
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var todoRouter = require('./routes/todo');
// var usersRouter = require('./routes/users');
// var usersRouter = require('./routes/users');

var app = express();


app.use(session({
  // resave: false,
  //  saveUninitialized: false,
  secret: 'test' //secret的值建议使用随机字符串
  //  cookie: { maxAge: 60 * 1000 * 30 } // 过期时间（毫秒）
}));


// 设置views文件夹为存放视图文件的目录，即存放模板文件的地方
// dirname为全局变量，存储当前正在执行的脚本所在的目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');

// 设置/public/favicon.ico为favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 加载解析json的中间件
app.use(bodyParser.json());
// 加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

// 加载日志中间件
app.use(logger('dev'));

// 加载解析cookie的中间件
app.use(cookieParser());
// 设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制器
app.use('/', indexRouter);


app.use('/users', usersRouter);

app.use('/todo', todoRouter);

// catch 404 and forward to error handler
// 捕获404错误，并转发到错误处理器
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// 盛传环境下的错误处理器，将错误信息渲染error模板并显示到浏览器中
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // 开发环境下的错误处理器，将错误信息渲染error模板并显示到浏览器中
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// 导出app实例，供其他模块调用
module.exports = app;
