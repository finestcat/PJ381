const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const assert = require('assert');
const http = require('http');
const url = require('url');

const mongourl = 'mongodb+srv://admin:123@cluster0.nndk5cp.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'inventory';
const client = new MongoClient(mongourl);

app.set('view engine','ejs');

const SECRETKEY = 'I want to pass COMPS381F';

const users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.status(200).render('home',{name:req.session.username});
	}
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true
			req.session.username = req.body.name;	 // 'username': req.body.name		
		}
	});
	res.redirect('/');
});


app.get('/create', function(req, res){
    return res.status(200).render("create");
});

app.post('/create', function(req, res){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connected successfully to the DB server.");
        const db = client.db(dbName);
        
        documents["_id"] = ObjectID;        
		documents["inventoryID"] = req.body.restaurantID;	
		documents['name']= req.body.name;
		documents['category']= req.body.cuisine;
		documents['status']= req.body.number;
        documents['userID']= req.body.description;
		documents['date']= req.body.description;
		documents['remark']= req.body.description;

        console.log("...putting data into documents");
        
        documents["ownerID"] = `${req.session.userid}`;
        
        if(documents.restaurantID){
            console.log("...Creating the document");
            createDocument(db, documents, function(docs){
                client.close();
                console.log("Closed DB connection");
                return res.status(200).render('info', {message: "Document is created successfully!"});
            });
        } else{
            client.close();
            console.log("Closed DB connection");
            return res.status(200).render('info', {message: "Invalid entry - Restaurant ID is compulsory!"});
        }
    });
    //client.close();
    //return res.status(200).render('info', {message: "Document created"}); 
});





app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
