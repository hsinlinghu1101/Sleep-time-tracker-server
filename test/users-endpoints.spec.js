const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function(){
  let db;
  const { testUsers }= helpers.makeDataFixtures();
  const testUser = testUsers[0];

  before(`make knex instance`, ()=>{
    db= knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', ()=> db.destroy());
  before('cleanup', ()=> helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST/api/user`, () =>{
    context(`User Validation`, () =>{
      beforeEach('insert users', ()=>
        helpers.seedUsers(
          db,
          testUsers
        )
      );
      const requireFields =['user_name', 'user_age', 'password'];

      requireFields.forEach(field =>{
        const registerAttemptBody={
          user_name: 'test user_name',
          user_age: 1,
          password: 'test password'
        };
        it(`responds with 400 required error when '${field}' is missing`, ()=>{
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/user')
            .send(registerAttemptBody)
            .expect(400, {
              error:`Missing '${field}'in request body`
            });
        });
      });

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () =>{
        const userShortPassword={
          user_name:'test user_name',
          user_age: 1,
          password:'1234567',  
        };
        return supertest(app)
          .post('/api/user')
          .send(userShortPassword)
          .expect(400, {
            error:`Password must be longer than 8 characters`
          });
      });
     
      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          user_name: 'test user_name',
          password: '*'.repeat(73),
          user_age: 1,
        };
           
        return supertest(app)
          .post('/api/user')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });
      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          user_name: 'test user_name',
          password: ' 1Aa!2Bb@',
          user_age: 1,
        };
        return supertest(app)
          .post('/api/user')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
 
      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          user_name: 'test user_name',
          password: '1Aa!2Bb@ ',
          user_age: 1,
        };
        return supertest(app)
          .post('/api/user')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_name: 'test user_name',
          password: '11AAaabb',
          user_age: 1,
        };
        return supertest(app)
          .post('/api/user')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` });
      });
    });

    context(`Happy path`, ()=> {
      it(`responds 201, serialized user, storing bcrypted password`, () =>{
        const newUser={
          user_name:'test user_name',
          user_age: '2',
          password: 'Newpassword123!'
        };

        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.user_age).to.eql(newUser.user_age);
            expect(res.body).to.not.have.property('passwprd');
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`);
          })
          .expect(res => 
            db
              .from('sleeptime_users')
              .select('*')
              .where({id: res.body.id})
              .first()
              .then(row =>{
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.user_age).to.eql(newUser.user_age);
                return bcrypt.compare(newUser.passwprd, row.password);
              })
              .then(compareMatch =>{
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
