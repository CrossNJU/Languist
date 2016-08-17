/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {globalSchema} from '../../models/globalSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {getUserStarred, getPublicRepos, addAnewUser} from '../api/github_user'
import {getRepoInfo, getRepoLanguages, addNewRepo} from '../api/github_repo'
var superagent = require('superagent');

var getAccessURL = 'https://github.com/login/oauth/access_token';

function getCurrentUser(callback){
  globalSchema.findOne({global_num: 1}, (err, glo) => {
    callback(glo.current_user);
  });
}

function login(username, password, callback){
  userSchema.findOne({login: username}, (err, user) => {
    if (user == null) callback("no such user!");
    else {
      if (user.password == password) {
        //update current user
        globalSchema.update({global_num: 1}, {current_user: login}, {upsert: true}, (err, res) => {
          console.log(res);
        });
        callback(1);
      }
      else if (user.password === undefined) callback("password not set yet!");
      else callback("password error!");
    }
  });
}

function register(username, password, callback){
  var conditions = {login : username };
  var update     = {$set : {
    password: password}
  };
  userSchema.update(conditions, update, (err, res) => {
    if (err) callback(err);
    else {
      callback(1);
    }
  });
  //update current user
  globalSchema.update({global_num: 1}, {current_user: login}, {upsert: true}, (err, res) => {
    console.log(res);
  });
}

function updateWhenLogin(login){
  //get star repos
  getUserStarred(login, 1, [], (ret) => {
    var conditions = {login : login };
    var update     = {$set : {
      star_num: ret.length,
      star_repos: ret}
    };
    userSchema.update(conditions, update, (err, res2) => {
      console.log("update user star repos!");
      console.log(res2);
    });
    for (let repo_fullname of ret) {
      getRepoInfo(repo_fullname, info => {
        github_repoSchema.findOne({full_name: repo_fullname}, (err, check)=>{
          //add new repo
          if (check == null){
            addNewRepo(info);
          }
        });
      });
    }
  });
  //get followers
  //get use_languages
  getPublicRepos(login, 1, [], (ret) => {
    var conditions = {login : login };
    var update     = {$set : {
      repos: ret}
    };
    userSchema.update(conditions, update, (err, res2) => {
      console.log("update user repos!");
      console.log(res2);
    });
    for (let repo of ret){
      getRepoLanguages(repo, languages => {
        var conditions = {login : login };
        for (let language of languages){
          var update     = {$addToSet : {
            use_languages: language}
          };
          userSchema.update(conditions, update, (err, res2) => {
            //console.log("add to user languages!");
            //console.log(res2);
          });
        }
      });
    }
  });
}

export var saveUser = (code, callback) => {
  superagent
    .post(getAccessURL)
    .send({ client_id: 'd310933db63d64f563a0', client_secret: '82093b09a6840ed8fba314dd7089a7bb45e687fe', code: code})
    .set('Accept', 'application/json')
    .end(function(err, sres){
      if (err) {
        console.log('err: ' + err);
        callback(0);
        return;
      }
      //console.log(sres.body);
      let access_token = sres.body.access_token;
      if (access_token === undefined) {
        console.log('undefined!');
        callback(0);
        return;
      }
      superagent
        .get('https://api.github.com/user')
        .query({ access_token: access_token})
        .accept('json')
        .end((err, ssres) => {
          if (err){
            return console.log(err);
          }
          callback(1);
          let json = JSON.parse(ssres.text);
          //console.log(ssres.text);

          //insert new users
          userSchema.findOne({login: json.login}, (err, check) => {
            if (check == null) {
              addAnewUser(json, access_token);
            }else {
            }
          });
          updateWhenLogin(json.login);
        });
    });
};

export {getCurrentUser, login, register}
