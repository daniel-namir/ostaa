/*  Daniel Namir 
    This file creates the server for the app.

*/
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');

const port = 80;

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true })); 

const db = mongoose.connection;
const mongoDBURL = 'mongodb://localhost/ostaa';

var schema = mongoose.Schema;

var UserSchema = new schema({
    username: String,
    password: String,
    listings: [],
    purchases: []
});

var User = mongoose.model('User', UserSchema );

var ItemSchema = new schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});

var Item = mongoose.model('Item', ItemSchema );

app.use(express.static('public_html'))

//Set up default mongoose connection
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//get request to get the list of users
app.get('/get/users', (req, res) => {
    User.find({})
    .exec(function (err, results) {
        if (err) return handleError(err);
        res.send(JSON.stringify(results));
  });
});

//get request to get the list of items
app.get('/get/items', (req, res) => {
    Item.find({})
    .exec(function (err, results) {
        if (err) return handleError(err);
        res.send(JSON.stringify(results));
  });
});

//get request to get the list of listings items of USERNAME
app.get('/get/listings/:USERNAME', (req, res) => {
    User.find({username: req.params.USERNAME})
    .exec((err, results) => {
        if (err) return res.end('FAIL');
        for (var i in results) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(JSON.stringify(results[i].listings));
        }
    });
});

//get request to get the list of purchases items of USERNAME
app.get('get/purchases/:USERNAME', (req, res) => {
    User.findOne({username: req.params.USERNAME})
    .exec((err, results) => {
        if (err) return res.end('FAIL');
        res.setHeader('Content-Type', 'text/plain');
        res.send(JSON.stringify(results[0].purchases));
    });
});

//get request to get the list of users that contains the KEYWORD in them
app.get('search/users/:KEYWORD', (req, res) => {
    User.find({})
    .exec(function (err, results) {
        if (err) return res.end('FAIL');
        const newList = [];
        for (i in results) {
            if (results[i].username.includes(req.params.KEYWORD)) {
                newList.push(results[i]);
            }
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(JSON.stringify(newList));        
    })
});

//get request to get the list of items that contains the KEYWORD in them
app.get('search/items/:KEYWORD', (req, res) => {
    Item.find({})
    .exec(function (err, results) {
        if (err) return res.end('FAIL');
        const newList = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].description.includes(req.params.KEYWORD)) {
                newList.push(results[i]);
            }
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(JSON.stringify(newList));        
    })
});

//post request that add users to the database
app.post('/add/user/', (req, res) => {
    var newUser = new User({ 
        username: req.body.username, 
        password: req.body.password
    })
    newUser.save( (error) => {
        if (error) res.end('PROBLEM: ' + res.status);
        res.send('SAVED');
    });
});

//post request that add items to the database and as listings/purchases to the user
app.post('/add/item/:USERNAME', (req, res) => {
    var newItem = new Item({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        stat: req.body.stat
    });
    User.find({ username: req.params.USERNAME })
        .exec((error, results) => {
            if (newItem.stat == 'SALE') {
                results[0].listings.push(newItem._id);
                console.log('Item added.');
                if (results.length != 1) console.log('Could not find seller.');
            }
            if (newItem.stat == 'SOLD') {
                results[0].purchases.push(newItem._id);
                console.log('Item added.');
                if (results.length != 1) console.log('Could not find seller.');
            }
            results[0].save(function (err) { if (err) console.log('An error occurred'); });
        })
        newItem.save( (error) => {
            if (error) res.end('PROBLEM: ' + res.status);
        });
    });

//get request to clear the database
app.get('/clear', (req, res) => {
    db.dropDatabase();
});

app.listen(port, () => {
    console.log('Server has started');
});