/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {addAnewUser, addAnewGitHubUser} from '../api/github_user'
import {setClient} from '../api/github_conf'
import {updateWhenLogin, updateInitialInfo} from '../logic/UpdateWhenLogin'
import {SUCCESS, FAIL, PASSWORD_ERROR, NOT_FOUND, client_id, client_secret, setSignal_login_wait, logger} from '../config'
var superagent = require('superagent');
var md5 = require('js-md5');

var getAccessURL = 'https://github.com/login/oauth/access_token';

var test_login = false;

function login(username, password, callback) {
  userSchema.findOne({login: username}, (err, user) => {
    if (user == null) callback(NOT_FOUND);
    else {
      if (user.password == md5(password)) {
        // updateWhenLogin(username);
        // updateInitialInfo(username);
        callback(SUCCESS);
      }
      else if (user.password === undefined) callback(PASSWORD_ERROR);
      else callback(FAIL);
    }
  });
}

function register(username, password, callback) {
  var conditions = {login: username};
  var update = {
    $set: {
      password: md5(password)
    }
  };
  userSchema.update(conditions, update, (err, res) => {
    if (err) callback(FAIL);
    else {
      callback(SUCCESS);
    }
  });
}



export var saveUser = (code, callback) => {
  logger.debug('authority code:'+code);
  superagent
    .post(getAccessURL)
    .send({client_id: client_id, client_secret: client_secret, code: code})
    .set('Accept', 'application/json')
    .end(function (err, sres) {
      if (err) {
        //console.log('err: ' + err);
        callback(0);
        return;
      }
      //console.log(sres.body);
      let access_token = sres.body.access_token;
      if (access_token === undefined) {
        logger.error('access token undefined!');
        callback(0);
        return;
      }
      //set client of github user to get data
      setClient(access_token);
      superagent
        .get('https://api.github.com/user')
        .query({access_token: access_token})
        .accept('json')
        .end((err, ssres) => {
          if (err) {
            return -1;
          }
          let json = JSON.parse(ssres.text);
          callback(json.login);

          //insert new users
          userSchema.findOne({login: json.login}, (err, user) => {
            if (user == null){
              addAnewUser(json.login, access_token, () => {
                setSignal_login_wait(0);
                updateInitialInfo(json.login);
              });
            } else {
              let update = {
                $set: {
                  access_token: access_token
                }
              };
              userSchema.update({login: json.login}, update, (err, res) => {
                //console.log('update new access token!');
              });
              updateInitialInfo(json.login);
            }
          });
          addAnewGitHubUser(json, () => {
              updateWhenLogin(json.login);
          });
        });
    });
};

export {login, register}

//upsertUser('balda', () => {
//  console.log('ok');
//});
