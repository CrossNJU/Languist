/**
 * Created by raychen on 16/7/21.
 */

import mongoose from 'mongoose'
import github_userSchema from '../../models/github_userSchema'
import userSchema from '../../models/userSchema'
import language from '../../models/languageSchema'
import repoSchema from '../../models/github_repoSchema'
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

var t1 = new github_userSchema({"login": "cr", "send": [], is_done: true});
var test_code = 4;

switch (test_code){
  case 1:{
    t1.save((err, res) => {
      if (err) return console.error(err);
      console.log('save successfully: '+res.login);
    });
  }break;
  case 2:{
    github_userSchema.update({}, {star_repo_fullname: []},{ multi: true }, (err, res) => {
      console.log(res);
    });
  }break;
  case 3:{
    github_userSchema.find({is_done: false}, (err, users) => {
      console.log(users.length);
      for (let i = 0; i < 20000; i++) {
        let person = users[i];
        //console.log(JSON.stringify(person));
        getUserStarred(person.login, 1, [], (v) => {
          if (err) return console.error(err);
          if (v === undefined) return console.log('undefined');
          github_userSchema.update({login: person.login}, {star_repo_fullname: v, is_done: true}, { multi: true }, (err, res) => {
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
    userSchema.findOne({login: 'RickChem1' }, function (err, person) {
      if (err) return console.error(err);
      console.log(person);
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

        var res_final = await new Promise(function(resolve, reject){
          repoSchema.find({main_language: lang.language}).sort({'star_num': -1}).limit(10)
            .exec(async function(err, posts) {
              if (err){
                reject(err);
              }else {
                let temp = [];
                if (posts.length > 0){
                  console.log(posts[0].fullname);
                  for (let j=0;j<posts.length;j++){
                    temp[j] = posts[j].fullname;
                  }
                }
                var res2 = await new Promise(function(reso, rej){
                  language.update({ language: lang.language}, {ranked_repo: temp}, (err, res) => {
                    if (err){
                      rej(err);
                    }else {
                      reso(res);
                    }
                  });
                });
                console.log(res2);
                resolve('success!');
              }
            });
        });
        console.log(res_final);
      }
    })
  }break;
  case 7:{
    var q = repoSchema.find({main_language: "JavaScript"}).sort({'star_num': -1}).limit(20);
    q.exec(function(err, posts) {
      console.log(posts);
    });
  }break;
  case 8:{
    language.update({ language: 'PAWN'}, {ranked_repo: posts}, (err, res) => {
      console.log(res);
    });
  }break;
  case 9:{
    repoSchema.find({main_language: 'PAWN'}).sort({'star_num': -1}).limit(10)
      .exec(function(err, posts) {
        if (err){
          reject(err);
        }else {
          console.log(posts);
        }
      });
  }break;
  case 10:{
    let s = "how/old";
    let p = s.split("/");
    console.log(p);
  }break;
  case 11:{
    userSchema.remove({avatar_url: undefined}, (err, res)=>{
      if (err) return console.error(err);
      console.log(res);
    });
  }break;
}



