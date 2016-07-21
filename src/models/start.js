/**
 * Created by raychen on 16/7/14.
 */

import mongoose from 'mongoose'
//import kitten from './kittySchema'
import language from './languageSchema'
import application from './applicationSchema'
import repository from './repositorySchema'
import tag from './tagSchema'
import user from './userSchema'
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

//user.find({'name':'user_name'},function(err,res){
//  if (err) return console.log(err);
//  console.log(res[0].fork);
//});

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
//  star: 0,
//  fork: 0,
//  view: 0,
//  language_id: ['578f5381b9bfb2686dc9837b'],
//  application_id: ['578f5381b9bfb2686dc9837a'],
//  description: 'description:sssaaa',
//  url: 'url_test',
//  createTime: date1,
//  updateTime: date2,
//  tag: ['578f5381b9bfb2686dc9837a'],
//  avatar_url: 'avatar_url_test'
//});
//saveToDB(r1);
var d3 = new Date(2015,11,1);
var u1 = new user({
  login: "__login",
  name: "__name",
  type: "__type",
  avatar_url: "__avatar_url",
  html_url: "__html_url",
  language:[{
    language_id: '578f5381b9bfb2686dc9837b',
    level: -1
  }],
  application_id: ['578f5381b9bfb2686dc9837a'],
  email: "__email",
  star_num: -1,
  starred_num: -1,
  fork_num: -1,
  follower_num: -1,
  following_num: -1,
  subscription_num: -1,
  public_gist_num: -1,
  public_repo_num: -1,
  location: "__location",
  blog: "__blog",
  company: "__company",
  created_at: d3,
  star_repo_ids: ['578f5a75bfe1fb501c0f8035'],
  fork_repo_ids: ['578f5a75bfe1fb501c0f8035']

});
saveToDB(u1);

//var c4 = new kitten({ name: 'cat4', type: 'cat'});
//c4.findSimilarTypes((err, res) => {
//  log(res);
//});
