const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService ={
  hasUserWithUserName(db, user_name){
    return db('sleeptime_users')
      .where({user_name})
      .first()
      .then(user => !!user)
  },

  inserUser(db, newUser){
    return db
      .insert(newUser)
      .into('sleeptime_users')
      .returning('*')
      .then(([user])=> user)
  },
  validatePassword(password){
    if(password.length < 8){
      return 'Password must be longer than 8 character'
    }
    if(password.length > 72){
      return 'Password must be less than 72 character'
    }
    if(password.startWith(' ') || password.endWith(' ')){
      return 'Password must not start or end with empty space'
    }
    if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password){
    return bcrypt.hash(password, 12)
  },
  serializeUser(user){
    return{
      id:user.id,
      user_name: xss(user.user_name),
      user_age:xss(user.user_age)
    }
  },
};

module.exports= UsersService;