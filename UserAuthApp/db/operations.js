const logger = require(appRoot  + '/logger');
const { User, Blog, Tag } = require(appRoot + '/db/sequelize')

// create a user
function createUser (userObj) {
    return User.create(userObj)
        .then(user => {
          return(user);
        }).catch(err => {
          var errorMessage;
          if (err.name == "SequelizeUniqueConstraintError") {
            errorMessage = `Email [${userObj.email}] already exists.`;
          } else if (err.name == "SequelizeValidationError") {
            errorMessage = `[${err.errors[0].path}] validation(${err.errors[0].validatorName}) is failed, `;
          } else {
            errorMessage = `Registration Failed -> ${err.errors[0].message}`;
          }
          logger.error(errorMessage);
          throw(errorMessage)
        })
}

// get all users
function getAllUsers () {
    return User.findAll()
    .then(users => {
      return(users)
    })
    .catch(err => {
      var errorMessage = err;

      logger.error(errorMessage);
      throw(errorMessage)
    })
}
// TODO: All below (NOT TESTED)!!
// create a blog post
/* Example input (NOT TESTED)
  newBlog: 
    {
      userId: 5,
      blog: {text: "asdasdasd....Blog text...asdasdasd"} ,
      tags: ['tag1','tag2']
    }
*/
function createBlogPost (newBlog) {
    const {userId, blog, blogTags} = newBlog;
    // either find a tag with name or create a new one
    const tags = blogTags.map(tag => Tag.findOrCreate({ where: { name: tag.name }, defaults: { name: tag.name }})
                                         .spread((tag, created) => tag))
    console.log(JSON.stringify(tags));
    return User.findByPk(userId)
        .then(() => Blog.create(blog))
        .then(blog => Promise.all(tags).then(storedTags => blog.addTags(storedTags)).then(() => blog))
        .then(blog => Blog.findOne({ where: {id: blog.id}, include: [User, Tag]}))
        .then(blogWithAssociations => {
          return(blogWithAssociations)
        })
        .catch(err => {
          var errorMessage = `User with id = [${userId}] doesn\'t exist.`;

          logger.error(errorMessage);
          throw(errorMessage)
        })
}

// find blogs belonging to one user
function getBlogById(userId) {
    return Blog.findAll({ include: [
        { model: User, where: { id: userId } },
        { model: Tag }
    ]}).then(blogs => {
      return (blogs)
    }).catch(err => {
      var errorMessage = err;

      logger.error(errorMessage);
      throw(errorMessage)
    });
}

// find blogs belonging to all blogs
function getAllBlogs() {
    return Blog.findAll({ include: [Tag, User]})
    .then(blogs => {
      return(blogs)
    }).catch(err => {
      var errorMessage = err;

      logger.error(errorMessage);
      throw(errorMessage)
    });
}

// find blogs by tag
function getBlogsByTag(tag) {
    Blog.findAll({
        include: [
            { model: Tag, where: { name: tag } }
        ]
    })
    .then(blogs => {
      return(blogs)
    }).catch(err => {
      var errorMessage = err;

      logger.error(errorMessage);
      throw(errorMessage)
    });
}

module.exports = {
  createUser,
  getAllUsers,
  createBlogPost,
  getBlogById,
  getAllBlogs,
  getBlogsByTag
}