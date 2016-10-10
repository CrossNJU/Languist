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

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/access.log',
      maxLogSize: 1024,
      backups: 4,
      category: 'normal'
    }
  ]
});
export var logger = log4js.getLogger('normal');
logger.setLevel('TRACE');

function mon_conn() {
  mongoose.connect('mongodb://localhost/languist');
  var db = mongoose.connection;
  //test connection
  db.on('error', () => {
    logger.error('connect error!');
  });
  db.once('open', () => {
    logger.info('connected!');
  });
}

function mon_disconn() {
  mongoose.disconnect((err) => {
    logger.error('disconnect err');
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
  getSignal,
  setSignal,
  setUser,
  getUser,
  getSignal_init,
  setSignal_init,
  setSignal_login_wait,
  getSignal_login_wait
}
