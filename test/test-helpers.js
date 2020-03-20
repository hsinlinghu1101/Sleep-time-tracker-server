const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');

function makeUsersArray(){
  return[
    {
      id: 1,
      user_name: 'test-user1',
      user_age: 1,
      password: 'Passworrd123!'
    },
    {
      id: 2,
      user_name: 'test-user2',
      user_age: 2,
      password: 'Passworrd123!'
    },
    {
      id: 3,
      user_name: 'test-user3',
      user_age: 3,
      password: 'Passworrd123!'
    }
  ]
}

function makeDataArray(users){
  return [
    {
      id:1,
      data_created: '2020-02-22T19:10:25.000Z',
      bed_time:'2020-02-22T11:10:25.000Z',
      wakeup_time:'2020-02-23T08:10:25.000Z',
      user_id: users[0].id 
    },
    {
      id:2,
      data_created: '2020-02-22T19:10:25.000Z',
      bed_time:'2020-02-22T11:10:25.000Z',
      wakeup_time:'2020-02-22T08:10:25.000Z',
      user_id: users[1].id 
    },
    {
      id:3,
      data_created: '2020-02-22T19:10:25.000Z',
      bed_time:'2020-02-22T11:10:25.000Z',
      wakeup_time:'2020-02-23T08:10:25.000Z',
      user_id: users[2].id 
    },
  ]
}

function makeExpectedData( data=[]){
    
console.log(data)
  return {
    id:data.id,
    data_created:data.data_created,
    bed_time:data.bed_time,
    wakeup_time:data.wakeup_time,
    user_id:data.user_id,
    user_age:1
  }
}

function makeDataFixtures(){
  const testUsers = makeUsersArray()
  const testData = makeDataArray(testUsers)
  return { testUsers, testData }
}

function cleanTables(db){
  return db.raw(
      `TRUNCATE
      sleeptime_users,
      sleeptime_data
      RESTART IDENTITY CASCADE`
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id}, secret, {
     subject: user.user_name,
     algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

function seedUsers(db, users){
  const preppedUsers = users.map(user =>({
    ...user,
    password:bcrypt.hashSync(user.password, 1)
  }))
  return db.into('sleeptime_users').insert(preppedUsers)
     .then(()=>
       db.raw(
         `SELECT setval('sleeptime_users_id_seq', ?)`,
         [users[users.length -1].id]
       )
     )
}
function seedDataTable(db, users, data){
  return db 
    .into('sleeptime_users')
    .insert(users)
    .then(()=>
      db
        .into('sleeptime_data')
        .insert(data)
    )
    
}

module.exports={
  makeUsersArray,
  makeDataArray,
  makeExpectedData,
  makeDataFixtures,
  cleanTables,
  seedDataTable,
  seedUsers,
  makeAuthHeader
}

