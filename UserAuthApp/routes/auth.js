const router = require('express').Router();
const logger = require(appRoot  + '/logger');

const userOperations = require(appRoot + '/db/userOperations')

/*
Example Request Body = 
	{
	    "username": "testUser",
	    "email"   : "m123@mail.com",
	    "password": "123456"
	}
*/
router.post('/register', (req, res) => {
	var user = {
		name 		: req.body.username,
		email		: req.body.email,
		password 	: req.body.password
	}
	userOperations.createUser(user).then(createdUser => {
		logger.info("\nUser is created. -> " + JSON.stringify(createdUser));
		res.json(createdUser);
	}).catch(error => {
		res.status(400).json({"error": error})
	});

});

router.post('/login', (req, res) => {
	const body = req.body;
	res.send(body);
	// res.json();
});

module.exports = router;