Sleep Time Tracker

Link to live app: https://sleep-time-tracker.now.sh/

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


How to use the App -

If you are a new user, please register an account.

![s1](https://user-images.githubusercontent.com/47201201/77196838-5c5b7d00-6aa1-11ea-9a44-2be11bd5dea5.png)

If you already have an account please log in

![s2](https://user-images.githubusercontent.com/47201201/77196847-5d8caa00-6aa1-11ea-9d9c-a9f2ff10929c.png)

Provide the date and time when you went to bed and when you woke up

![s3](https://user-images.githubusercontent.com/47201201/77196849-5f566d80-6aa1-11ea-9dae-cc331e226a65.png)

Get all your record, you can also delete or add record when you log in.

![s4](https://user-images.githubusercontent.com/47201201/77196851-60879a80-6aa1-11ea-9c47-5b205c1f8fa4.png)


A summary section-

When you woke up in the morning and felt restless, did you wonder when did you go to sleep last night? Did you wonder how many hours of sleep you had yesterday, or the day before to reconcile the total amount of hours slept to your feeling of being fresh and productive during those days? Sleep tracker is here to help!

Sleep is one of our necessities we need in our hectic and rushing world full of stress. Your productivity and quality of life depends on it.  Tracking your sleep will allow you to identify whether or not you are getting enough of it and if it's quality rest. Lack of quality sleep has a detrimental effect on mood, weight loss, exercise performance, recovery, energy, productivity, immune system strength, cardiovascular function and brain health.

The most important reason to track your sleep is that sleep is good for your health, so you need to be sure you're getting enough of it. Research has shown that getting enough sleep can:

-Decrease your chance of motor vehicle accidents

-Lessen your likelihood of obesity, since sleep deprivation can increase appetite

-Reduce your risk of diabetes and heart problems

-Improve your concentration, reaction time and memory

-Boost your moods and creativity

-Enhance your immune system to help ward off colds and infections

-Increase regulation of appetite, energy use and weight control
 
You should track your sleep to help you know what amount feels optimal to you. Hint: it's probably not a full eight hours a night. Although the optimal amount of sleep is between seven to eight hours a night for most people, that's not a universal rule. The optimal amount of sleep varies among individuals, and women tend to need less. Also, you don’t need to track your sleep every night. People who do tend to get too focused on day-to-day variations, which are normal with sleep.

Features:
-calculated users' total hours of sleep and display a message based on users' age and sleep hours.

-keep users daily total sleep hours

-allow for users to delete their record
 
 Technology used -
 React, CSS, Node, Express, and PostgreSQL.

 


 Technology used -
 
 React, CSS, Node, Express, and PostgreSQL.

