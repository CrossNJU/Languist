/**
 * Created by raychen on 16/7/14.
 */

import mongoose from 'mongoose'
//import kitten from './kittySchema'
import language from './_languageSchema'
import application from './_applicationSchema'
import repository from './../mysql-models/my_repoSchema'
import tag from './_tagSchema'
import user from './../mysql-models/my_userSchema'
import userlanguage from './userlanguageSchema'
var schema =  mongoose.Schema;

mongoose.connect('mongodb://localhost/languistdb');

var db = mongoose.connection;

//test connection
db.on('error', () => {
  console.log('connect error!');
});
db.once('open', () => {
  console.log('connected!');
});

//util functions
function saveToDB(ins){
  ins.save((err, res) => {
    if (err) return console.error(err);
    console.log('save successfully: '+res.name);
  });
}



function log(res){
  console.log(res);
}

user.find({'name':'Jeremy Stephens'},function(err,res){
  if (err) return console.log(err);
  console.log(res);
});

//user.findSimilarTypes((err,res) => {
//  log(res);
//});

//tests
//var c1 = new kitten({ name: 'cat1', type: 'cat'});
//var c2 = new kitten({ name: 'cat2', type: 'cat'});
//var c3 = new kitten({ name: 'cat3', type: 'cat'});
//
//saveToDB(c1);
//saveToDB(c2);
//saveToDB(c3);
//var a1 = new application({name:'test'});
//saveToDB(a1);
//
//var l1 = new language({name:'java',application_id:['578f52d489e4324849439aad']});
//saveToDB(l1);
//
//var t1 = new tag({name:'test'});
//saveToDB(t1);
//var date1 = new Date(2016,1,1);
//var date2 = new Date(2016.7,10);
//var r1 = new repository({
//  fullname: 'fullname',
//  owner: 'owner',
//  star_num: -1,
//  fork_num: -1,
//  view_num: -1,
//  subscriber_num: -1,
//  contributor_num: -1,
//  collaborators_num: -1,
//  issue_num: -1,
//  language_id: [''],
//  application_id: [''],
//  description: 'description:sssaaa',
//  url: 'url_test',
//  createTime: date1,
//  updateTime: date2,
//  tag: [''],
//  avatar_url: 'avatar_url_test'
//});
//saveToDB(r1);
//var d3 = new Date(2015,11,1);
//var u1 = new user({
//  login: "__login",
//  name: "__name",
//  type: "__type",
//  avatar_url: "__avatar_url",
//  html_url: "__html_url",
//  language:[{
//    language_id: '578f5381b9bfb2686dc9837b',
//    level: -1
//  }],
//  application_id: ['578f5381b9bfb2686dc9837a'],
//  email: "__email",
//  star_num: -1,
//  starred_num: -1,
//  fork_num: -1,
//  follower_num: -1,
//  following_num: -1,
//  subscription_num: -1,
//  public_gist_num: -1,
//  public_repo_num: -1,
//  location: "__location",
//  blog: "__blog",
//  company: "__company",
//  created_at: d3,
//  star_repo_ids: ['578f5a75bfe1fb501c0f8035'],
//  fork_repo_ids: ['578f5a75bfe1fb501c0f8035']
//
//});
//saveToDB(u1);
//var c4 = new kitten({ name: 'cat4', type: 'cat'});
//c4.findSimilarTypes((err, res) => {
//  log(res);
//});


var test_code = 2;

function updateUserLan(login,languages){
  user.update({"login": login}, {$set:{"language":languages}},function(err,res){
    if (err){
      console.log(err);
    }else {
      console.log("success");
    }
  });
}

function getSingelUser(login){
  var promise = user.findOne({"login":login}).exec();
  return promise;
}

switch (test_code){
  case 1:
    userlanguage.find({},function(err,res) {

      if (res != null){
        for (let i = 0;i < 744488;i++){
          var ulan = res[i];
          //for (let ulan of res) {
          if (ulan != null){
            let lan_id = ulan._id;
            let login = ulan.user_login;
            updateUserLangusge(lan_id,login);
          }

        }
      }
    });
    break;
  case 2:
    user.find({}, (err,users)=>{
      for (let singelUser of users) {
        userlanguage.find({"user_login":singelUser.login},(err,langs)=>{
          if (langs != null){
            var languages = [];
            var login = '';
            for (let l of langs) {
              login = l.user_login;
              var sl = {
                language_id: l._id,
                level: 0
              };
              languages.push(sl);
            }
            user.update({"login":login},{$set:{"language":languages}},(err,res)=>{
              if (err){
                console.log(err);
              }else{
                console.log('final success');
              }
            });
          }else{
            console.log('lang null');
          }
        });
      }
    });
    break;
  case 3:
        console.log('test');
        break;
}



