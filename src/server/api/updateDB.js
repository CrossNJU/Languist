/**
 * Created by raychen on 16/7/21.
 */

import mongoose from 'mongoose'
import user from './UserSchema'
import {getUserStarred} from './User_github'

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

//test connection
db.on('error', () => {
  console.log('connect error!');
});
db.once('open', () => {
  console.log('connected!');
});

var t1 = new user({"login":"cr", "send": [], is_done: true});

//t1.save((err, res) => {
//  if (err) return console.error(err);
//  console.log('save successfully: '+res.login);
//});
//
//user.
//find({
//  is_done: undefined
//}).
//exec((err, users) => {
//  for (let i=0;i<users.length;i++){
//    let user = users[i];
//    user.is_done = false;
//    user.save((err, res) => {
//      console.log(res);
//    });
//  }
//});

let login = 'RobertDober';
//getUserStarred(login, 1, [], (v) => {
//  user.findOne({ 'login': login }, 'login send is_done', function (err, person) {
//    if (err) return console.error(err);
//    person.send = v;
//    person.is_done = true;
//    person.save((err, res) => {
//      if (err) return console.error(err);
//      console.log('save successfully: '+res.login);
//    });
//  })
//});

user.findOne({ 'login': login }, 'login send is_done', function (err, person) {
  if (err) return console.error(err);
  console.log(person.send.length);
});
