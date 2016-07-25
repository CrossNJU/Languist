/**
 * Created by raychen on 16/7/21.
 */

import mongoose from 'mongoose'
import user from '../../models/userSchema'
import language from '../../models/languageSchema'
import repo from '../../models/repositorySchema'
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

var t1 = new user({"login": "cr", "send": [], is_done: true});
var test_code = 6;

switch (test_code){
  case 1:{
    t1.save((err, res) => {
      if (err) return console.error(err);
      console.log('save successfully: '+res.login);
    });
  }break;
  case 2:{
    user.update({}, {star_repo_fullname: []},{ multi: true }, (err, res) => {
      console.log(res);
    });
  }break;
  case 3:{
    user.find({is_done: false}, (err, users) => {
      console.log(users.length);
      for (let i = 0; i < 20000; i++) {
        let person = users[i];
        //console.log(JSON.stringify(person));
        getUserStarred(person.login, 1, [], (v) => {
          if (err) return console.error(err);
          if (v === undefined) return console.log('undefined');
          user.update({login: person.login}, {star_repo_fullname: v, is_done: true}, { multi: true }, (err, res) => {
            console.log('i:'+i+' -- '+JSON.stringify(res));
          });
          //person.star_repo_fullname = v;
          //person.is_done = true;
          //person.save((err, res) => {
          //  if (err) return console.error(err);
          //  console.log('save successfully: ' + res.login);
          //});
        });
      }
    });
  }break;
  case 4:{
    user.findOne({ 'login': login }, 'login send is_done', function (err, person) {
      if (err) return console.error(err);
      console.log(person.send.length);
    });
  }break;
  case 5:{
    language.find({}, (err, langs) => {
      let dis = [], len = langs.length, len_dis = 0;
      for (let i=0;i<len;i++){
        let index = dis.findIndex(k => k==langs[i].name);
        if (index == -1){
          dis[len_dis] = langs[i].name;
          len_dis++;
        }
      }
      console.log(dis);
    });
  }break;
  case 6:{
    language.find({}, async (err, langs)=>{
      let i = 0;
      for (let lang of langs){
        i++;
        console.log(lang.language+': '+i);
        //console.log(lang.language);
        //repo.find({main_language: lang.language}).sort({'star_num': -1}).limit(10)
        //  .exec(function(err, posts) {
        //    console.log(posts.length);
        //    language.update({ language: lang.language}, {ranked_repo: posts}, (err, res) => {
        //      console.log(res);
        //    });
        //  });
        var res = await new Promise(function(resolve, reject){
          language.update({ language: lang.language}, {test: i}, (err, res) => {
            if (err){
              reject(err);
            }else {
              console.log(res);
              resolve('success!');
            }
          });
        });
        console.log(res);
      }
    })
  }break;
  case 7:{
    var q = repo.find({main_language: "JavaScript"}).sort({'star_num': -1}).limit(20);
    q.exec(function(err, posts) {
      console.log(posts);
    });
  }break;
  case 8:{
    language.update({ language: "C"}, {ranked_repo: ['cr']}, (err, res) => {
      console.log(res);
    });
  }break;
}



