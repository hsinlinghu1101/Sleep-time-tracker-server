const knex= require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers');


describe.skip('Data Endpoints', function(){
  let db;
  const {
    testUsers,
    testData,
  } = helpers.makeDataFixtures()

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
    
  describe.only(`Get/api/data`, () =>{
    context(`Given no data`, ()=>{
      it(`responds with 200 and an empty list`, ()=> {
        return supertest(app)
          .get('/api/data')
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

      it(`responds with 200 and all of the things`, ()=>{
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
});