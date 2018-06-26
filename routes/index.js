//這個文件相當於我們的model層，我們和數據庫的交互邏輯一般也寫在這個文件中
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log(req.session.id);
  //console.log(req.session.cookie);
  console.log("@@@SeID:" + req.cookies['connect.sid']);
  //console.log(req.headers.cookie);
  //console.log(req.cookies.userX);
  // if (req.cookies.userX) {
  //   console.log(req.cookies);

  // } else {
  //   // res.cookie('isVisit', 1, { maxAge: 60 * 1000 });
  res.cookie('userX', "1");
  //   // 
  // }
  var sessionId = req.session.id;

  MongoClient.connect(url, function (err, db) {
    var dbd = db.db('tododb');
    dbd.collection("todo_collection", function (err, collection) {
      collection.find({ user_id: sessionId }).toArray(function (err, items) {
        if (err) throw err;

        res.render('index', { title: 'Express Todo Example', xx: "TODO練習", todoList: items });
      });
    });
    db.close();
  });
});

module.exports = router;
