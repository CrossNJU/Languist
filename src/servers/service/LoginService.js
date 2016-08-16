/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {globalSchema} from '../../models/globalSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {getUserStarred} from '../api/github_user'
import {getRepoInfo} from '../api/github_repo'
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
      if (user.password == password) callback(1);
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
  })
}

function updateWhenLogin(login, callback){
  getUserStarred(login, 1, [], (ret) => {
    var conditions = {login : login };
    var update     = {$set : {
      star_num: ret.length,
      star_repos: ret}
    };
    for (let repo_fullname of ret) {
      getRepoInfo(repo_fullname, info => {
        github_repoSchema.findOne({full_name: repo_fullname}, (err, check)=>{
          if (check == null){
            let update2 = {
              $set: {
                full_name: info.full_name,
                owner: info.owner.login,
                owner_avatar_url: info.owner.avatar_url,
                description: info.description,
                url: info.html_url,
                clone_url: info.clone_url,
                subscribers_count: -1,
                forks_count: info.forks_count,
                stars_count: info.stargazers_count,
                contributors_count: -1,
                contributors: [],
                collaborators_count: -1,
                collaborators: [],
                pullrequests_count: -1,
                issues_count: info.open_issues_count,
                size: info.size,
                updated_at: info.updated_at,
                created_at: info.created_at,
                main_language: info.language,
                languages: []
              }
            };
            github_repoSchema.update({full_name: repo_fullname}, update2, {upsert: true}, (err, res) => {
              console.log(res);
            });
          }
        });
      });
    }
    userSchema.update(conditions, update, (err, res2) => {
      globalSchema.update({global_num: 1}, {current_user: login}, {upsert: true}, (err, res) => {
        callback(1);
      })
    });
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
          let json = JSON.parse(ssres.text);
          //console.log(ssres.text);
          //insert new users
          userSchema.findOne({login: json.login}, (err, check) => {
            if (check == null) {
              var conditions = {login : json.login };
              var update     = {$set : {
                login: json.login,
                avatar_url: json.avatar_url,
                type: json.type,
                name: json.name,
                company: json.company,
                location: json.location,
                email: json.email,
                public_repos: json.public_repos,
                public_gists: json.public_gists,
                followers: json.followers,
                following: json.following,
                created_at: json.created_at,
                updated_at: json.updated_at,
                star_num: -1,
                star_repos: [],
                level: 0,
                language: [],
                access_token: access_token,
                password: "123"}
              };
              var options = {upsert : true};
              userSchema.update(conditions, update, options, function(error, res){
                console.log("new user!");
              });
            }else {
            }
          });
          updateWhenLogin(json.login, callback);
        });
    });
};

export {getCurrentUser, login, register}
