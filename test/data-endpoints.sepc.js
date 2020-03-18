const knex= require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers');


describe('Data Endpoints', function(){
  let db;
  const {
    testUsers,
    testData,
  } = helpers.makeDataFixtures()

  function makeAuthHeader(user) {
    const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
    return `Basic ${token}`
  }

  before('make knex instance', ()=>{
    db=knex({
      client:'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', ()=> helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`protected endpoints`, () =>{
    beforeEach('insert user', ()=>
      helpers.seedDataTable(
        db,
        testUsers,
        testData
      )
    )

    const protectedEndpoints=[
      {
        name: `GET/api/data/my`,
        path:`/api/data/my`
      }
    ]
    protectedEndpoints.forEach(endpoint => {
      describe(endpoint.name, () => {
        it(`responds with 401 'Missing bearer Token' when no basic token`, () => {
          return supertest(app)
            .get(endpoint.path)
            .expect(401, { error: `Missing bearer Token`})
        })
    
        it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
          const validUser = testUsers[0]
          const invalidSecret ='bad-secret'
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
            .expect(401, { error: `Unauthorized request` })
        })
    
        it(`responds 401 'unauthorized request' when invalid user`, () => {
          const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
            .expect(401, { error: `Unauthorized request` })
        })
    
      })
    })
  })
    
  describe(`Get/api/data`, () =>{
    context(`Given no data`, ()=>{
      it(`responds with 200 and an empty list`, ()=> {
        return supertest(app)
          .get('/api/data')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(401)
      })
    })

    context(`Given there are data in the database`, ()=>{
      beforeEach('give data', () =>
        helpers.seedDataTable(
          db,
          testUsers,
          testData
        )
      );

      it(`responds with 200 and all of the data`, ()=>{
        const userData = testData.filter(data => data.user_id === testUsers[0].id)
        const expectedData = userData.map(data =>
          helpers.makeExpectedData(
            data
          )
        )
        return supertest(app)
          .get(`/api/data/my`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedData)
      });
    });
  });
  describe(`POST/api/data`, ()=>{
      beforeEach('insert data', ()=>
       helpers.seedDataTable(
           db,
           testUsers,
       )
      )
     it(`creates a data, responding with 201 and the new data`, function(){
         this.retries(3)
         const testUser = testUsers[0]
         const newData={
           data_created:'2020-02-22',
           bed_time:'11:10:25',
           data_wakeup: '2020-02-22',
           wakeup_time:'08:10:25'
         }
         return supertest(app)
          .post('/api/data')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newData)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.data_created).to.eql(`${newData.data_created}T08:00:00.000Z`)
          expect(res.body.bed_time).to.eql(`2020-02-22T19:10:25.000Z`)
          expect(res.body.wakeup_time).to.eql(`2020-02-22T16:10:25.000Z`)
          expect(res.body.user_id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/data/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('sleeptime_data')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.data_created).to.eql(newData.data_created)
              expect(row.bed_time).to.eql(newData.bed_time)
              expect(row.wakeup_time).to.eql(newData.wakeup_time)
              expect(row.user_id).to.eql(testUser.id)
            })
        )
     }) 
  })
  describe(`DELETE/api/data`, () =>{
    context('Given ther are data in database', ()=>{
      const testData = helpers.makeDataArray(testUsers)
     
      beforeEach('insert data', ()=>{
        helpers.seedDataTable(
          db,
          testUsers,
          testData
        )
      })
      it('responds with 204 and removes the data', ()=>{
         const idToRemove =2
         const expectedData = testData.filter(data => data.id !== idToRemove)
         return supertest(app)
           .delete(`/api/data/${idToRemove}`)
           .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
           .expect(204)
           .then(res => 
              supertest(app)
                 .get(`/api/data`)
                 .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                 .expect({})
            )

      })
    })
  })
});