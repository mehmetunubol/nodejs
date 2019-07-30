const logger = require(appRoot  + '/logger');
const Sequelize = require('sequelize')
const UserModel = require(appRoot + '/db/models/user')
const BlogModel = require(appRoot + '/db/models/blog')
const TagModel = require(appRoot + '/db/models/tag')

const sequelize = new Sequelize('uaa', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const User = UserModel(sequelize, Sequelize)
// BlogTag will be our way of tracking relationship between Blog and Tag models
// each Blog can have multiple tags and each Tag can have multiple blogs
const BlogTag = sequelize.define('blog_tag', {})
const Blog = BlogModel(sequelize, Sequelize)
const Tag = TagModel(sequelize, Sequelize)

Blog.belongsToMany(Tag, { through: BlogTag, unique: false })
Tag.belongsToMany(Blog, { through: BlogTag, unique: false })
Blog.belongsTo(User);


/*
  sequelize.sync() will create all of the tables in the specified database. 
  If you pass {force: true} as a parameter to sync method, 
  it will remove tables on every startup and create new ones.
*/
sequelize.sync({ force: false })
  .then(() => {
    logger.info(`Database & tables created in sequelize.js`)
  })

module.exports = {
  User,
  Blog,
  Tag
}

/* https://www.codementor.io/mirko0/how-to-use-sequelize-with-node-and-express-i24l67cuz

Let's walk through what's happening here.

After requiring our models and dependencies, we instantiate Sequelize and define all details necessary for connecting to the database. Your specific database and credentials will differ.

Next, we instantiate our models by passing a sequelize instance and library itself to required model files.

After models are created, we define their relationships. Blog.belongsTo(User) will create a foreign key on the Blog model — userId.
Foreign keys, unless you specify otherwise, will follow camelCase naming convention.

The fun part is the relationship between Blog and Tag models. We want to have a table for all tags so we can maintain uniqueness but we also want to allow many blog posts to have multiple tags.

Other association methods wouldn't work for us because we don't really want to create a foreign key on any of our models. What we want is a table that will hold connections between blogs and tags. This table doesn't have to have any fields other than blogId and tagId.

By creating an empty model, BlogTag, that we use as a through property, while setting up belongsToMany, Sequelize is actually adding two foreign keys to BlogTag — blogId and tagId.

Our BlogTag table will look like this

+-----------+----------+------+-----+---------+-------+
| Field     | Type     | Null | Key | Default | Extra |
+-----------+----------+------+-----+---------+-------+
| createdAt | datetime | NO   |     | NULL    |       |
| updatedAt | datetime | NO   |     | NULL    |       |
| blogId    | int(11)  | NO   | PRI | NULL    |       |
| tagId     | int(11)  | NO   | PRI | NULL    |       |
+-----------+----------+------+-----+---------+-------+


*/