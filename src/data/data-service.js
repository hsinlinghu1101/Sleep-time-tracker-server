const knex = require('knex');

const DataService={
  //Each user can't choose the same date twice  
  hasDataAlready(db, data_created, id){
    return db('sleeptime_data')
      .where(knex.raw('DATE(data_created)=?', data_created))
      .where({user_id:id})
      .first()
      .then(data => !!data);
  },
 
  getAllDataByUser(db, id){
    return db
      .from('sleeptime_data')
      .select('sleeptime_data.*', 'sleeptime_users.user_age')
      .innerJoin('sleeptime_users','sleeptime_data.user_id','sleeptime_users.id')
      .where('sleeptime_data.user_id', id);   
  },
  getById(db, id){
    return db
      .from('sleeptime_data')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteData(db, id){
    return db
      .from('sleeptime_data')
      .where({id})
      .delete();
  },

  insertData(db, newData){
    return db
      .insert(newData)
      .into('sleeptime_data')
      .returning('*')
      .then(([data]) => data);
  },
  
  updateData(db, id, newData){
    return db('sleeptime_data')
      .where({id})
      .update(newData);
  },
   
  serializeData(data){
    
    return{
      id:data.id,
      data_created:data.data_created,
      bed_time:data.bed_time,
      wakeup_time:data.wakeup_time,
      user_id:data.user_id,
    };
  }

};

module.exports = DataService;
