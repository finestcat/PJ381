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
	{name: 'user1', password: 'user123'},
	{name: 'user2', password: 'user234'},
    {name: 'user3', password: 'user345'}
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

app.get('/result', (req,res) => {
    res.status(200).render('result');
});


app.get('/search', (req,res) => {
	res.status(200).render('search');
});

const searchDocument = (db, searchDoc, callback) => {
    db.collection('Inventory').find(searchDoc, (error, results) => {
        if (error) throw error;
        console.log(results);
        callback();
    });
};

app.post('/search', (req,res) => {
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

            searchDocument(db, document, () => {
            client.close();
            res.status(200).render('result', {items: docs});
    });
    client.close();
});
});

app.get('/logout', (req,res) => {
	req.session = null;  
	res.redirect('/');
});  		

//

// 2. RESTful APIs for the inventory system 
// [The core part of the web service]

//



/*  CREATE

curl -X POST -H "Content-Type: application/json" --data '{"id":"4","name":"ABC Powerbank", "cat":"electronics", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/create

*/

app.post('/api/stock/create', (req,res) => {

    

    console.log(req.body)

    const client = new MongoClient(mongourl);

    client.connect((err) => {

        assert.equal(null,err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);

        let newDoc = {};

        newDoc['id'] = req.fields.id;
        newDoc['name'] = req.fields.name;
        newDoc['category'] = req.fields.cat;
        newDoc['status'] = req.fields.status;
        newDoc['location'] = req.fields.location;
        newDoc['date'] = req.fields.date;
        
        db.collection('Inventory').insertOne(newDoc,(err,results) => {

                    assert.equal(err,null);

                    client.close()

                    res.status(200).json(newDoc);
                    res.status(200).json("The above document has been added").end();
                    

                })

            });

})

 
/* READ

curl -X GET -H "Content-Type: application/json" --data '{"id":"4","name":"ABC Powerbank", "cat":"electronics", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/read

*/

app.get('/api/stock/read', (req,res) => {

console.log(req.body)

    const client = new MongoClient(mongourl);

    client.connect((err) => {

        assert.equal(null,err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);

        let oldDoc = {};

        oldDoc['id'] = req.fields.id;
        oldDoc['name'] = req.fields.name;
        oldDoc['category'] = req.fields.cat;
        oldDoc['status'] = req.fields.status;
        oldDoc['location'] = req.fields.location;
        oldDoc['date'] = req.fields.date;
        
        db.collection('Inventory').find(oldDoc,(err,results) => {

                    assert.equal(err,null);

                    client.close()

                    res.status(200).json(oldDoc);
                    
                    res.status(200).json("Found document").end();

                    

                })

            });

                   


        
})





/*  UPDATE

curl -X PUT -H "Content-Type: application/json" --data '{"id":"4","name":"DEF Router", "cat":"accessories", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/update/id/4

*/

app.put('/api/stock/update/id/:id', (req,res) => {

if (req.params.id) {

    console.log(req.body)

    const client = new MongoClient(mongourl);

    client.connect((err) => {

        assert.equal(null,err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);



        let criteria = {}

        criteria['id'] = req.params.id



        let updateDoc = {};

        Object.keys(req.fields).forEach((key) => {

            updateDoc[key] = req.fields[key];

        })

        console.log(updateDoc)

        
           

        db.collection('Inventory').updateOne(criteria, {$set: updateDoc},(err,results) => {

           assert.equal(err,null);

           client.close()

           res.status(200).json(results);
           res.status(200).json("The above document has been updated").end();

        })

        

    })

} else {

    res.status(500).json({"error": "missing inventory id"});

}

})



/*  DELETE

curl -X DELETE -H "Content-Type: application/json" --data '{"id":"4","name":"DEF Router", "cat":"accessories", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/delete

*/

app.delete('/api/stock/delete', function(req,res) {

console.log(req.body)

    const client = new MongoClient(mongourl);

    client.connect((err) => {

        assert.equal(null,err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);

        let oldDoc = {};

        oldDoc['id'] = req.fields.id;
        oldDoc['name'] = req.fields.name;
        oldDoc['category'] = req.fields.cat;
        oldDoc['status'] = req.fields.status;
        oldDoc['location'] = req.fields.location;
        oldDoc['date'] = req.fields.date;
        
        db.collection('Inventory').remove(oldDoc,(err,results) => {

                    assert.equal(err,null);

                    client.close()

                    res.status(200).json(oldDoc).end();
                    
                    

                    

                })

            });










});
//

// End of Restful APIs

//





app.get('/*', (req,res) => {

//res.status(404).send(`${req.path} - Unknown request!`);

res.status(404).render('info', {message: `${req.path} - Unknown request!` });

})



app.listen(app.listen(process.env.PORT || 8099));
