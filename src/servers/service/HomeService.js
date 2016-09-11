/**
 * Created by raychen on 16/7/19.
 */

import {github_userSchema} from '../../models/github_userSchema'
import {userSchema} from '../../models/userSchema'
import {connect} from '../config'
import {getNextDayRecommendData} from '../logic/HandleRecommendLogic'
import {getSignal} from '../config'
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
      console.log('err occurs: ' + err.message);
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
  console.log(getSignal());
  let before = await new Promise((resolve, reject) => {
    async.until(function() {
        return getSignal() > 0;
      },
      function(cb) {
        //console.log('try');
        setTimeout(cb, 500);
      },
      function(err) {
        // 4s have passed
        console.log('done!');
        console.log(err); // -> undefined
        if (err) reject(err);
        resolve(1);
      });
  });
  let ans = [];
  if (before == 1) {
    console.log('get it!');
    ans = await getNextDayRecommendData(userName);
  }
  //console.log(ans);
  callback(ans);
}

export {getFlowListData}

//connect();
//getFlowListData("RickChem", (res) => {
//  console.log(res);
//});
