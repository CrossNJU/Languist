/**
 * Created by raychen on 16/7/19.
 */

import {github_userSchema} from '../../models/github_userSchema'
import {userSchema} from '../../models/userSchema'
import {connect} from '../config'
import {getNextDayRecommendData} from '../logic/HandleRecommendLogic'

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
  github_userSchema.findOne(condition, (err, user) => {
    if (err) {
      console.log('err occurs: ' + err.message);
    } else {
      data.followingCount = user.following;
      data.followersCount = user.followers;
      data.starredCount = user.star_num;
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
  let ans = await getNextDayRecommendData(userName);
  console.log(ans);
  callback(ans);
}

export {getFlowListData}

//connect();
//getFlowListData("RickChem", (res) => {
//  console.log(res);
//});
