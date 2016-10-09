/**
 * Created by raychen on 16/7/19.
 */

import {github_userSchema} from '../../models/github_userSchema'
import {userSchema} from '../../models/userSchema'
import {connect} from '../config'
import {getNextDayRecommendData, getStart} from '../logic/HandleRecommendLogic'
import {getSignal, getUser, getSignal_init, setSignal_login_wait, getSignal_login_wait} from '../config'
import {record_log} from '../service/LogService'
import {updateWhenLogin, updateInitialInfo} from '../logic/UpdateWhenLogin'

var async = require("async");

function awaitUpdate_Rec() {
  return new Promise((resolve, reject) => {
    async.until(function () {
        return getSignal() > 0;
      },
      function (cb) {
        setTimeout(cb, 500);
      },
      function (err) {
        record_log(getUser(), getUser() + ' updatewhenlogin done in recommend', 'mark');
        if (err) reject(err);
        resolve(1);
      });
  });
}

function awaitUpdate_init() {
  return new Promise((resolve, reject) => {
    async.until(function () {
      return getSignal_init() > 0;
    },
    function (cb) {
      setTimeout(cb, 500);
    },
    function (err) {
      if (err) reject(err);
      resolve(1);
    });
  });
}

export var getCoverData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=> {
    data.langs = user.language.length;
    github_userSchema.findOne(condition, (err, user_git) => {
      data.avatar_url = user_git.avatar_url;
      data.name = user_git.login;
      callback(data);
    });
  });
};

export var getCountData = async (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  let w = await awaitUpdate_init();
  userSchema.findOne(condition, (err, user) => {
    if (err) {
      console.log('err occurs in home count data: ' + err.message);
    } else {
      data.followingCount = user.followings.length;
      data.followersCount = user.followers.length;
      data.starredCount = user.star_repos.length;
      callback(data);
    }
  });
};

export var getLangListData = (userName, callback) => {
  let data = [];
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=> {
    let langs = user.language;
    for (let i = 0; i < langs.length; i++) {
      data[i] = {};
      data[i].name = langs[i].lang_name;
      data[i].level = langs[i].lang_level;
    }
    callback(data);
  });
};

async function getFlowListData(userName, callback) {
  record_log(getUser(), getUser() + ' get updatewhenlogin signal: ' + getSignal(), 'query');
  record_log(getUser(), getUser() + ' to get recommend date in HomeService', 'query');
  let ans = await getNextDayRecommendData(userName);
  if (ans.length == 0) {
    let t = await awaitUpdate_Rec();
    let now = await getStart(userName);
    ans = await getNextDayRecommendData(userName);
    record_log(getUser(), getUser() + ' first get recommend data', 'mark');
    //console.log(now);
  }
  console.log('rec records: '+ans.length);
  callback(ans);
}

async function hasRecommendData(login, callback){
  let ans = await getNextDayRecommendData(login);
  if (ans.length == 0){
    setSignal_login_wait(0);
    callback(0);
  } else {
    callback(1);
  }
}

export {getFlowListData, hasRecommendData}

// connect();
// updateInitialInfo('RickChem');
// getCountData('RickChem', (ans) => {
//   console.log(ans);
// })
//getFlowListData('RickChem', ret => {
//  addInfoToList('RickChem', ret, true, () => {
//    console.log(ret);
//  });
//});

//console.log((new Date()).getHours());
setInterval(() => {
  console.log('now the time is: '+ (new Date()).toLocaleString());
}, 1000*60*20);

//setInterval(() => {
//  console.log('=----------: '+ getSignal_login_wait());
//}, 1000);
