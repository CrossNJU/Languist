/**
 * Created by raychen on 16/7/19.
 */

import {github_userSchema} from '../../models/github_userSchema'
import {userSchema} from '../../models/userSchema'
import {connect} from '../config'
import {getNextDayRecommendData, getStart} from '../logic/HandleRecommendLogic'
import {getSignal, getUser} from '../config'
import {record_log} from '../service/LogService'
import {updateWhenLogin} from '../logic/UpdateWhenLogin'

var async = require("async");

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

export var getCountData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
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

function awaitUpdate() {
  return new Promise((resolve, reject) => {
    async.until(function () {
        return getSignal() > 0;
      },
      function (cb) {
        // console.log('await update');
        setTimeout(cb, 500);
      },
      function (err) {
        // 4s have passed
        record_log(getUser(), getUser() + ' updatewhenlogin done in recommend', 'mark');
        //console.log(err); // -> undefined
        if (err) reject(err);
        resolve(1);
      });
  });
}

async function getFlowListData(userName, callback) {
  record_log(getUser(), getUser() + ' get updatewhenlogin signal: ' + getSignal(), 'query');
  record_log(getUser(), getUser() + ' to get recommend date in HomeService', 'query');
  let ans = await getNextDayRecommendData(userName);
  if (ans.length == 0) {
    let t = await awaitUpdate();
    let now = await getStart(userName);
    ans = await getNextDayRecommendData(userName);
    record_log(getUser(), getUser() + ' first get recommend data', 'mark');
    //console.log(now);
  }
  console.log('rec records: '+ans.length);
  callback(ans);
}

export {getFlowListData}

//connect();
//getFlowListData('RickChem', ret => {
//  addInfoToList('RickChem', ret, true, () => {
//    console.log(ret);
//  });
//});

//console.log((new Date()).getHours());
