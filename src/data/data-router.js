const express =require('express');
const path = require('path');
const dataRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth')
const DataService = require('./data-service');
const jsonBodyParser= express.json()

const serializeData = data =>({
  id:data.id,
  date_created:data.data_created,
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
            error:{ message: `Data doesn't exist` }
          })
        }
        res.json(serializeData(data))
        res.data = data;
        next();
      })
     
      .catch(next)
  });

  dataRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next)=>{
    const {data_created, bed_time, wakeup_time}= req.body;
    const newData ={data_created, bed_time, wakeup_time}
    for( const[key, value] of Object.entries(newData))
      if(value == null)
        return res.status(400).json({
          error:`Missing ${key} in request body`
        })
    newData.user_id = req.user.id;
    DataService.insertData(
      req.get('db'),
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