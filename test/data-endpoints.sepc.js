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
          .expect(200, [])
      })
    })

    context(`Given there are data in the database`, ()=>{
      beforeEach('insert data', () =>
        helpers.seedDataTable(
          db,
          testUsers,
          testData
        )
      );

      it(`responds with 200 and all of the data`, ()=>{
        const expectedData = testData.map(data =>
          helpers.makeExpectedData(
            testUsers,
            data
          )
        )
        return supertest(app)
          .get(`api/data`)
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
           data_created:'2020-02-22 19:10:25-07',
           bed_time:'2020-02-22 19:10:25-07',
           wakeup_time:'2020-02-22 19:10:25-07'
         }
         return supertext(app)
          .post('/api/data')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newData)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.data_created).to.eql(newData.data_created)
          expect(res.body.bed_time).to.eql(newData.bed_time)
          expect(res.body.wakeup_time).to.eql(newData.wakeup_time)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/data`)
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
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
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
     }) 
  })
});