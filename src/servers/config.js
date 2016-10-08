/**
 * Created by raychen on 16/7/22.
 */

import mongoose from 'mongoose'

export const SUCCESS = 1;
export const FAIL = 0;
export const NOT_FOUND = -1;
export const PASSWORD_ERROR = -2;

 //export const client_id = 'c1bb199ad072f9f1639d';
 //export const client_secret = 'e89f1fdfaa227f6ba0d12953c33e6d79a6e18192';

export const client_id = 'd310933db63d64f563a0';
export const client_secret = '82093b09a6840ed8fba314dd7089a7bb45e687fe';

var signal = 1;
var signal_init = 1;
var signal_login_wait = 0;
var current_user = null;

function mon_conn() {
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

function mon_disconn() {
  mongoose.disconnect((err) => {
    console.log('disconnect err');
  });
}

//**
function mon_conn2(callback) {
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

function getSignal() {
  return signal;
}

function getSignal_init() {
  return signal_init;
}

function getSignal_login_wait(){
  return signal_login_wait;
}

function setSignal(value) {
  signal = value;
}

function setSignal_init(value) {
  signal_init = value;
}

function setSignal_login_wait(value){
  signal_login_wait = value;
}

function getUser() {
  return current_user;
}

function setUser(value) {
  current_user = value;
}

export {
  mon_conn as connect,
  mon_disconn as disconnect,
  mon_conn2 as connect_callback,
  getSignal,
  setSignal,
  setUser,
  getUser,
  getSignal_init,
  setSignal_init,
  setSignal_login_wait,
  getSignal_login_wait
}
