const express =require('express');
const path = require('path');
const dataRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const DataService = require('./data-service');
const jsonBodyParser= express.json();

const serializeData = data =>({
  id:data.id,
  date_created:data.data_created,
  bed_time:data.bed_time,
  wakeup_time:data.wakeup_time,
  user_id:data.user_id
});

dataRouter
  .use(requireAuth)
  .route('/my')
  .get((req, res, next) =>{
    DataService.getAllDataByUser(
      req.app.get('db'),
      req.user.id  
    )
     
      .then(data =>{
        if(!data){
          return res.status(404).json({
            error:{ message: `Data doesn't exist` }
          });
        }
        
        res.json(data);
        
        next();
      })
     
      .catch(next);
  });

dataRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next)=>{
    const {data_created, bed_time, data_wakeup, wakeup_time}= req.body;
    
    const newData ={
      data_created: new Date(`${data_created} 00:00`), 
      bed_time : new Date(`${data_created} ${bed_time}`), 
      wakeup_time: new Date(`${data_wakeup} ${wakeup_time}`)
    };
    
    for( const[key, value] of Object.entries(newData))
      if(value == null)
        return res.status(400).json({
          error:`Missing ${key} in request body`
        });
    newData.user_id = req.user.id;

    //data_created should be unique
    DataService.hasDataAlready(
      req.app.get('db'),
      data_created,
      req.user.id
    )
      .then(hasDataAlready =>{
        if(hasDataAlready)
        
          return res.status(400).json({error: 'Date already taken'});
        
        DataService.insertData(
          req.app.get('db'),
          newData
        )
          .then(data =>{
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${data.id}`))
              .json(DataService.serializeData(data));
          });
      })
      .catch(next);
      
  });
dataRouter
  .route('/:dataId')
  .delete(requireAuth, (req, res, next)=>{
    DataService.deleteData(
      req.app.get('db'),
      req.params.dataId
    )
      .then(data =>{
        res.status(204).end();
      })
      .catch(next);
  });



module.exports = dataRouter;