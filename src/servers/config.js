/**
 * Created by raychen on 16/7/22.
 */

import mongoose from 'mongoose'

function mon_conn(){
  mongoose.connect('mongodb://localhost/languist');
  var db = mongoose.connection;
//test connection
  db.on('error', () => {
    console.log('connect error!');
  });
  db.once('open', () => {
    console.log('connected!');
  });
}

function mon_disconn(){
  mongoose.disconnect((err)=>{
    console.log('disconnect err');
  });
}

export {
  mon_conn as connect,
  mon_disconn as disconnect}
