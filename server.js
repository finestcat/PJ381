const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const formidable = require('express-formidable');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = 'mongodb+srv://admin:123@cluster0.nndk5cp.mongodb.net/?retryWrites=true&w=majority'; 
const dbName = 'Project';

app.set('view engine','ejs');
app.set('views','./views');

const SECRETKEY = 'COMPS381F';

const users = new Array(
	{name: 'user1', password: 'user1'},
	{name: 'user2', password: 'user2'}
);
var document = {}

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    
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
			req.session.authenticated = true;    
			req.session.username = req.body.name;		
		}
	});
	res.redirect('/');
});

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('Inventory').find(criteria);
	cursor.toArray(function(err, docs){
        assert.equal(err, null);
        return callback(docs);
    });
};

app.get('/details', (req,res) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        const db = client.db(dbName);
        const criteria = {};

		findDocument(db, criteria, (docs) => {
			client.close();
		res.status(200).render('details', {items: docs});
	});
});

});


app.get('/create', (req,res) => {
	res.status(200).render('create');
});

const createDocument = (db, createDoc, callback) => {
    db.collection('Inventory').insertOne(createDoc, (error, results) => {
        if (error) {
            throw error;
        }
        callback();
    });
};

app.post('/create', (req,res) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        const db = client.db(dbName);
        const document = {	
            id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            status: req.body.status,
			location: req.body.location,
			date: req.body.date
        };

            createDocument(db, document, () => {
            client.close();
            res.redirect('/details');
    });
    client.close();
});
});

app.get('/delete?:id', (req,res) => {

    const client = new MongoClient(mongourl);
    const idDelete = req.query._id;

    client.connect((err) => {
        assert.equal(null, err);

        const db = client.db(dbName);
        
        db.collection("Inventory").deleteOne({_id: ObjectID(idDelete)},(err,result) =>{
            if(err){
            	throw err;
			};
            client.close();
        });
    });
    res.redirect('/details');
});

const editDocument = (db, idEdit, editDoc, upsert,callback) => {
    db.collection('Inventory').update({ _id: ObjectID(idEdit) },editDoc, upsert,(error, results) => {
        if (error) {
            throw error;
        }
        callback();
    });
};


app.get('/edit?:id', (req,res) => {
	const idEdit = req.query._id;
	const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        const db = client.db(dbName);
        const criteria = {
			_id: ObjectID(idEdit)
		};

		findDocument(db, criteria, (docs) => {
			client.close();
		res.status(200).render('edit', {docs});
		
	});
});
});



app.post('/edit', (req,res) => {
	const client = new MongoClient(mongourl);
	const idEdit = req.body._id
    client.connect((err) => {
        assert.equal(null, err);
       
        const db = client.db(dbName);
        const editDoc = { $set:{
			id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            status: req.body.status,
			location: req.body.location,
			date: req.body.date
		}};
		const upsert = { upsert: true };

		editDocument(db, idEdit, editDoc, upsert,() => {
		client.close();
		});
	client.close();
	});
	res.redirect('/details');
});

app.get('/search', (req,res) => {
	res.status(200).render('search',{});
});

app.post('/search', (req,res) => {
//
});

app.get('/logout', (req,res) => {
	req.session = null;  
	res.redirect('/');
});  		


app.listen(app.listen(process.env.PORT || 8099));
