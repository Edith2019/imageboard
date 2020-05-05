const express = require('express');
const app = express();
const db = require('./utils/db');
app.use(express.static('./public'));
const port = process.env.PORT || 8080;
//////////////file upload boilerplate////
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const conf = require('./config');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
app.use(express.json());

let secrets;
process.env.NODE_ENV === "production"
    ? (secrets = process.env)
    : (secrets = require("./utils/secrets"));

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

////////////////////////////////////////////

app.get('/cards', (req, res) => {
    console.log("reach cards route");
    db.getCards(req.params).then(result => {
        let cards = result.rows;
        console.log("cards", cards);
        res.json(cards);
    }).catch(err => {
        console.log("there is an error in gettin cards from db", err);
    });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    // console.log("made it to psot route upload"); //insert row into images table
    var urlAdd = conf.s3Url + req.file.filename;
    var titleAdd = req.body.title;
    var descriptionAdd = req.body.description;
    var userNameAdd = req.body.userName;
    db.addCards(titleAdd, descriptionAdd, userNameAdd, urlAdd).then(addCardsData => {
        res.json(addCardsData.rows[0]);
    }).catch(err => {
        console.log("error in catch post upload", err);
    });
});

app.get('/cards/comments/', (req, res) => {
    // console.log("made it to cards/comment");
    const id = req.query.id;
    const responseObject = {};
    db.getComments(id).then(result => {
        responseObject.commenting = result.rows;
        db.getPrevNextCard(id).then(resultTotal => {
            responseObject.prevNext = resultTotal.rows;
            res.json(responseObject);
        }).catch(err => {
            console.log("error in get prev next", err);
        });
    }).catch(err => {
        console.log("error in get comments", err);
    });
});

app.post('/uploadcomments', (req, res) => {
    // console.log("made it  to upload comment/post");
    var usercommentsAdd = req.body.usercomments;
    var textcommentsAdd = req.body.textcomments;
    var cardIdAdd = req.body.id;
    db.addComments(usercommentsAdd, textcommentsAdd, cardIdAdd).then(result => {
        res.json(result.rows[0]);
    }).catch(err => {
        console.log("error in sending comment to db", err);
    });
});

app.get('/card/smallId/:id', (req, res) => {
    // console.log("made it to rou cardsmallID");
    var lowestId = req.params.id;
    db.getMoreImages(lowestId).then(result => {
        res.json(result.rows);
    }).catch(err => {
        console.log("error it to rou cardsmallID", err);
    });
});

app.post('/cardsdelete', (req, res) => {
    // console.log("made it to delete");
    const idDelete = req.body.cardId;
    db.deleteCardComments(idDelete).then(() => {
        db.deleteCard(idDelete).then((response) => {
            res.json(response.rows);
        }).catch(err => {
            console.log("error", err);
        });
    }).catch(err => {
        console.log("error", err);
    });
});

if (require.main == module)
    app.listen(port, () => console.log(`I'm listening on port: ${port}`));