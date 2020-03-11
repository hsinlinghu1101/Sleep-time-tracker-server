const xss = require('xss')

const DataService={
  getAllDataByUser(knex, id){
    return knex
      .from('sleeptime_data')
      .select('*')
      .where({user_id:id})
      
  },

  insertData(knex, newData){
    return knex
      .insert(newData)
      .into('sleeptime_data')
      .returning('*')
      .then(([data]) => data);
  },
   
  serializeData(data){
    return{
      id:data.id,
      data_created:data.data_created,
      bed_time:data.bed_time,
      wakeup_time:data.wakeup_time,
      user_id:data.user_id
    };
  }

};

module.exports = DataService;
