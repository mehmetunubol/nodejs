const router = require('express').Router();
const logger = require(appRoot  + '/logger');

const operate = require(appRoot + '/db/operations')

router.get('/', (req, res) => {
	res.send('User Authentication Service');
});

router.post('/addUser', async function (req, res) {

	res.send('User Authentication Service');
});



router.post('/addBlog', (req, res) => {
	const userId = 1;
	const blog = //req.body.blog;
	{
		userId: 1,
		body: req.body.tags,
		text: req.body.blog
	}
	const reqTags = req.body.tags.split(',');
	const tags = [];
	for (let i = 0 ; i < reqTags.length; i++) {
		tags.push({
			name: reqTags[i]
		});
	}
	var blogData = {
		userId 		: userId,
		blog		: blog,
		blogTags	: tags
	}
	operate.createBlogPost(blogData).then(savedBlog => {
		logger.info("\nNew Blog is created. -> " + JSON.stringify(savedBlog));
		res.json(savedBlog);
	}).catch(error => {
		res.status(400).json({"error": error})
	});

});

module.exports = router;