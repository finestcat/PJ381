# Inventory management system

## Group: 16
## Student Name and ID: 
### Chan Ho (12661493),
### Tong Kin Lik (04598868)

### Application link: 
```
https://comps381f-group-16.onrender.com
```

********************************************
### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
Go to 
```
http://localhost:8099
```

********************************************
# Login
- User can access the Inventory management system by entering their username and password in the login page interface.

- There are 3 sets of userID and password:
```
[
	{userid: user1, password: user123},
	{userid: user2, password: user234},
	{userid: user3, password: user345}
]
```
- After a successful login, userid is stored in session, the user will enter the home page of the system.

********************************************
# Logout
- User can logout their account by clicking logout button in the home page interface.
- The session will be cleared after the user logout their account

********************************************
# CRUD service
- Create

- To create an inventory, click the Create A New Inventory Record link in the home page interface to enter the create page interface.

- The create interface may contain the following attributes with an example: 
	1)	Inventory ID (123456), it must be a 6 digits ID.
	2)	Inventory Name (HP Desktop)
	3)	Category (Computer hardware)
	4)	Status (Active)
	5)	Location (Room A123 10/F Block A)
	6)	Date (01-01-2023)

    - Remark:
    The attributes Inventory Name and Inventory ID are mandatory, the create page interface will not allow user to submit the form if they are blank. And the other attributes are optional.

- Once the user submit the form and sucessfully created an inventory record, the page will redirect them to the details page interface showing the details of all the inventory records.

********************************************
# CRUD service
- Read

- To read all the inventory records, click the View All Inventory Record(s) link in the home page interface to enter the details page interface.

- To search for inventory record(s), click the Search Inventory Record(s) link in the home page interface to enter the search page interface.

1) List all inventory records
	- details.ejs will display the details of all inventory records, user may edit or delete a record by clicking the relevant button
	

2) Search inventory by attributes
	- serach.ejs will allow user to search for inventory record(s) through Inventory Name, ID, Category, Status, Location, Date.
    - The search result will be displayed after the user filled in one of the fields and pressed the search button.
	- The user may perform edit or delete operation in the search result page.

********************************************
# CRUD service
- Update

- To update the details of each inventory record, clicking the Edit button in the details page interface to enter the edit page interface.

- All the attributes including the Inventory ID can be changed as the searching/updating criteria is the object ID of each inventory document.

- The update interface may contain the following attributes with an example: 
	1)	Inventory ID (123456), it must be a 6 digits ID.
	2)	Inventory Name (HP Desktop)
	3)	Category (Computer hardware)
	4)	Status (Active)
	5)	Location (Room A123 10/F Block A)
	6)	Date (01-01-2023)

	- In the above example, attributes including Inventory Name, ID, Category, Status, Location, Date can all be modified by the user.

    - Remark:
    The attributes Inventory Name and Inventory ID are mandatory, the update page interface will not allow user to submit the form if they are blank. And the other attributes are optional.

- Once the user submit the form and successfully updated the details of an inventory record, the page will redirect them to the details page interface showing the updated details of all inventory records.

********************************************
# CRUD service
- Delete
- The user can delete an inventory record by clicking the delete button through the details page interface.
- The delete criteria is the object ID of each inventory document.

********************************************
# Restful APIs for HTTP services (CRUD web services)


- In this project, there are four HTTP request types established for imposing RESTFUL APIs, i.e. POST, GET, PUT and DELETE ---->


1. POST 
       Purpose: A POST request is used for creating new inventory documents and recording in MongoDB as the database.
       Path URL:
	   ```
	    /api/stock/create
		```
       Test: 
	   ```
	   curl -X POST -H "Content-Type: application/json" --data '{"id":"4","name":"ABC Powerbank", "cat.":"electronics", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/create
	   ```

2. GET
       Purpose: A GET request is used for finding stored inventory records from MongoDB.
       Path URL:
	   ```
	    /api/stock/read
		```
       Test:
	   ```
	    curl -X GET -H "Content-Type: application/json" --data '{"id":"4","name":"ABC Powerbank", "cat":"electronics", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/read
		```

3. PUT
       Purpose: A PUT request is used for updating/editing stored inventory records.
       Path URL:
	   ```
	    /api/stock/update/id/:id
		```
       Test:
	   ```
	    curl -X PUT -H "Content-Type: application/json" --data '{"id":"4","name":"DEF Router", "cat":"accessories", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/update/id/4
		```

4. DELETE
       Purpose: A DELETE request is used for erasing existing records in MongoDB.
       Path URL: 
	   ```
	   /api/stock/delete
	   ```
       Test:
	   ```
	    curl -X DELETE -H "Content-Type: application/json" --data '{"id":"4","name":"DEF Router", "cat":"accessories", "status":"pending", "location":"Taipo", "date":"23 Nov 2023"}' localhost:8099/api/stock/delete
		```

