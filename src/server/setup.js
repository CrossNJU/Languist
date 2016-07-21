/**
 * Created by raychen on 16/7/22.
 */

import mongoose from 'mongoose'

function connect_mongo(){
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  //test connection
  db.on('error', () => {
    console.log('connect error!');
  });
  db.once('open', () => {
    console.log('connected to mongodb!');
  });
}

export {connect_mongo}
