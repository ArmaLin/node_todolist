var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



/* GET home page. */
router.get('/:id', function (req, res, next) {
    //抓get參數
    var id = req.params.id
    console.log('@@@@@get:', id);
});


function getDateTime() {
    let now = new Date();

    // let options = {
    //     weekday: 'long',
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit'
    // };
    return now.toLocaleString()
    //  return now.toLocaleString('zh-tw', options);
}



//INSERT
function createItem(request, response) {
    var sessionId = request.session.id;
    //抓form裡面 input 的 name
    var content = request.body.content;
    //  console.log('Create item@@@@@@@', content);
    MongoClient.connect(url, function (err, db) {

        if (err) throw err;
        //Write databse Insert/Update/Query code here..
        var dbd = db.db('tododb');
        // if (err) throw err;
        var myobj = { user_id: sessionId, content: content, updated_at: getDateTime() };
        dbd.collection("todo_collection").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("新增成功");
            db.close();
            response.redirect('/');
        });
    });
    //  response.redirect('/');
    //response.render('index', { title: '新增成功', xx: '標題', todoList: "" });
}
router.post('/', createItem);


//DELETE
function deleteItem(request, response) {
    var id = request.params.id;
    console.log('ObjectId("' + id + '")');

    MongoClient.connect(url, function (err, db) {
        var dbd = db.db('tododb');
        dbd.collection('todo_collection', function (err, collection) {
            collection.remove({ _id: ObjectId(id) }, { w: 1 }, function (err, result) {
                console.log('@@' + result);
                if (err) throw err;
                console.log('刪除成功');
                response.send("@@@@@@@@@");

            });
        });
        db.close(); //關閉連線
        //   response.redirect('/');
    });
    //  response.redirect('/');
}
router.delete('/:id', deleteItem);


//UPDATE
function updateItem(request, response) {
    var id = request.params.id;
    var content = request.body.content;

    //console.log('ObjectId("' + id + '")');
    console.log("@@:" + content);
    MongoClient.connect(url, function (err, db) {
        var dbd = db.db('tododb');
        dbd.collection('todo_collection', function (err, collection) {
            //第一個參數是要更新的條件，第二個參數$set:更新的欄位及內容.
            //第三個參數writeConcern，第四個參數執行update後的callback函式
            //  collection.update({ id: 1 }, { $set: { firstName: 'James', lastName: 'Gosling' } },
            collection.update({ _id: ObjectId(id) }, { $set: { content: content } },
                { w: 1 }, function (err, result) {
                    console.log('@@' + result);
                    if (err) throw err;
                    console.log('更新成功');

                    response.send("@@@@@@@@@");
                });
        });
        db.close();
        //  response.redirect('/');
    });
    //   res.redirect('/');
}
router.put('/:id', updateItem);



module.exports = router;
