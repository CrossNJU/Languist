/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {addAnewUser, addAnewGitHubUser} from '../api/github_user'
import {updateWhenLogin} from '../logic/UpdateWhenLogin'
var superagent = require('superagent');

var getAccessURL = 'https://github.com/login/oauth/access_token';

var test_login = false;

function login(username, password, callback) {
  userSchema.findOne({login: username}, (err, user) => {
    if (user == null) callback("no such user!");
    else {
      if (user.password == password) {
        callback(1);
      }
      else if (user.password === undefined) callback("password not set yet!");
      else callback("password error!");
    }
  });
}

function register(username, password, callback) {
  var conditions = {login: username};
  var update = {
    $set: {
      password: password
    }
  };
  userSchema.update(conditions, update, (err, res) => {
    if (err) callback(err);
    else {
      callback(1);
    }
  });
}



export var saveUser = (code, callback) => {
  superagent
    .post(getAccessURL)
    .send({client_id: 'd310933db63d64f563a0', client_secret: '82093b09a6840ed8fba314dd7089a7bb45e687fe', code: code})
    .set('Accept', 'application/json')
    .end(function (err, sres) {
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
        .query({access_token: access_token})
        .accept('json')
        .end((err, ssres) => {
          if (err) {
            return console.log(err);
          }
          callback(1);
          let json = JSON.parse(ssres.text);

          //insert new users
          addAnewUser(json, access_token);
          addAnewGitHubUser(json, () => {
            //update when login
            if (!test_login) updateWhenLogin(json.login);
          });
        });
    });
};

export {login, register}

//upsertUser('balda', () => {
//  console.log('ok');
//});
