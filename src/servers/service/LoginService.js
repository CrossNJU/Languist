/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {globalSchema} from '../../models/globalSchema'
import {getUserStarred} from '../api/github_user'
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
            access_token: access_token}
          };
          var options = {upsert : true};
          userSchema.update(conditions, update, options, function(error, res){
              getUserStarred(json.login, 1, [], (ret) => {
                var conditions = {login : json.login };
                var update     = {$set : {
                  star_num: ret.length,
                  star_repos: ret}
                };
                userSchema.update(conditions, update, (err, res2) => {
                  globalSchema.update({global_num: 1}, {current_user: json.login}, {upsert: true}, (err, res) => {
                    callback(1);
                  })
                })
              });
          });
        });
    });
};

export {getCurrentUser, login, register}
