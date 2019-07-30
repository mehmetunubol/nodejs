const logger = require(appRoot  + '/logger');
const { User } = require(appRoot + '/db/sequelize')
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

module.exports = {
  createUser,
  getAllUsers,
}