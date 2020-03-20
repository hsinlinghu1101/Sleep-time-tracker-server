Sleep Time Tracker

Link to live app: https://build-five-alpha.now.sh/

Link to heroku server: https://safe-lowlands-14338.herokuapp.com/api

Documentation of your API.

POST/api/auth/login

Login user account. Requires a request body

 POST https://git.heroku.com/safe-lowlands-14338.git/api/auth/login
 
  REQ BODY: { "user_name": "Demo", "Password": "Demopass123!" }

  HTTP STATUS 201 Created
  
  Location: https://git.heroku.com/safe-lowlands-14338.git/api/auth/login
  
  {
    
    "id": "1",
    
    "user_name": "Demo",
    
    "Password": "Demopass123!"
    
  }
  
POST/api/user

Create a new user account. Requires a request body.

 POST https://git.heroku.com/safe-lowlands-14338.git/api/user
 
  REQ BODY: { "user_name": "Demo", "user_age": "1" , "password":"Demopass123!"}

  HTTP STATUS 201 Created
  
  Location: https://git.heroku.com/safe-lowlands-14338.git/api/user
  
  { 
  
    "id":"1",
    
    "user_name": "Demo",
    
    "user_age": "1",
    
    "password":"Demopass123!"
    
  }
  
GET/api/data/my

Provides array of all data object of the user.

GET https://git.heroku.com/safe-lowlands-14338.git/api/data/my

  HTTP STATUS 200 OK
  
  [{
  
    "id":'1',
    
    'data_created':'2020-02-22 19:10:25-07',
    
    'bed_time':'2020-02-22 19:10:25-07',
    
    'wakeup_time':'2020-02-22 19:10:25-07',
    
    'user_id':'1',
    
    'user_age':'1',
    
  },
  
    {
    
      'id':'2',
      
    'data_created':'2020-02-22 19:10:25-07',
    
    'bed_time':'2020-02-22 19:10:25-07',
    
    'wakeup_time':'2020-02-22 19:10:25-07',
    
    'user_id':'1',
    
    'user_age':'1'
    
    }
    
  ]

POST/api/data

Create a new data. Requires a request body.

POST https://git.heroku.com/safe-lowlands-14338.git/api/data

  REQ BODY: { 
  
  "data_created": "2020-02-22 19:10:25-07", 
  
  "bed_time": "2020-02-22 19:10:25-07",
  
  "data_wakeup": "2020-02-22 19:10:25-07",
  
  "wakeup_time": "2020-02-22 19:10:25-07"
  
   }

  HTTP STATUS 201 Created
  
  Location: https://git.heroku.com/safe-lowlands-14338.git/api/data
  
  {
  
    "data_created": "2020-02-22 19:10:25-07",
    
    "bed_time": "2020-02-22 19:10:25-07",
    
    "data_wakeup": "2020-02-22 19:10:25-07",
    
    "wakeup_time": "2020-02-22 19:10:25-07"
    
  }

DELETE/api/data/:dataId

Deletes data matching id parameter from the user.

Example request/response:

  DELETE https://git.heroku.com/safe-lowlands-14338.git/api/data/1
    
  HTTP STATUS 204 No Content
  
  {} (empty)


 Technology used -
 
 React, CSS, Node, Express, and PostgreSQL.
