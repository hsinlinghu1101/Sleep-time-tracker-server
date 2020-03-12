

const DataService={
  getAllDataByUser(db, id){
    return db
      .from('sleeptime_data')
      .select('*')
      .where({user_id:id});
      
  },

  insertData(db, newData){
    return db
      .insert(newData)
      .into('sleeptime_data')
      .returning('*')
      .then(([data]) => data)
      .then(data =>
        DataService.getAllDataByUser(db, data.id)
      );
  },
   
  serializeData(data){
    const {user} = data;
    return{
      id:data.id,
      data_created:data.data_created,
      bed_time:data.bed_time,
      wakeup_time:data.wakeup_time,
      user:{
        id:user.id,
        user_name:user.user_name,
        user_age:user.user_age
      },
    };
  }

};

module.exports = DataService;
