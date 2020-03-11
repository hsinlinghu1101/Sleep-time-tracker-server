const express =require('express');
const path = require('path');
const dataRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth')
const DataService = require('./data-service');
const jsonBodyParser= express.json()

const serializeData = data =>({
  id:data.id,
  date_created: data.date_created,
  bed_time:data.bed_time,
  wakeup_time:data.wakeup_time,
  user_id:data.user_id
});

dataRouter
  .route('/:user_id')
  .get((req, res, next) =>{
    DataService.getAllDataByUser(
      req.app.get('db'),
      req.params.user_id    
    )
     
      .then(data =>{
        if(!data){
          return res.status(404).json({
            error:{ message: `Comment doesn't exist` }
          })
        }
        res.json(serializeData(data))
        res.data = data;
        next();
      })
     
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next)=>{
    const {date_created, bed_time, wakeup_time}= req.body;
    const newData ={date_created, bed_time, wakeup_time}

    for( const[key, value] of Object.entries(newData))
      if(value == null)
        return res.status(400).json({
          error:`Missing ${key} in request body`
        })
    newData.user_id = req.user.id;

    DataService.insertData(
      req.get.app('db'),
      newData
    )
      .then(data =>{
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${data.id}`))
          .json(DataService.serializeData(data))
      })
      .catch(next)
  })

module.exports = dataRouter;