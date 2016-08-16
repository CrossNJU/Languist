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

//**
function mon_conn2(callback){
  mongoose.connect('mongodb://localhost/languist');
  var db = mongoose.connection;
//test connection
  db.on('error', () => {
    console.log('connect error!');
    callback(0);
  });
  db.once('open', () => {
    console.log('connected!');
    callback(1);
  });
}

export {
  mon_conn as connect,
  mon_disconn as disconnect,
  mon_conn2 as connect_callback}
