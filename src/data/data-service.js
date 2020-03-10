const xss = require('xss')

const DataService={
  getAlldata(db){
    return db
      .from('sleep_data AS da')
      .select(
        'da.id',
        'da.data_created',
        'da.bed_time',
        'da.wakeup_time',
        'da.user_id',
        db.raw(
          ``
        )
      )
  }
}