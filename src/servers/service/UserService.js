/**
 * Created by raychen on 16/8/15.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getAUser} from '../logic/HandleRecommendLogic'
import {connect} from '../config'

function evaluateRecommend(login, name, type, callback) {
  userSchema.findOne({login: login}, (err, user) => {
    let rec = user.now_recommend;
    let index = rec.findIndex(j => {
      return (j.m_type == type) && (j.m_name == name)
    });
    let dislike = rec[index];
    rec.splice(index, 1);
    userSchema.update({login: login}, {$set: {now_recommend: rec}, $addToSet: {dislike: dislike}}, (err, res) => {
      console.log('update recommend feedback!');
      console.log(res);
      callback(1);
    })
  });
}

function getUserFollowings(login, callback) {
  userSchema.findOne({login: login}, async (err, user) => {
    let followings = user.followings;
    let ans = [];
    for (let i = 0; i < followings.length; i++) {
      let single = await getAUser(followings[i]);
      ans.push(single);
    }
    callback(ans);
  })
}

function getUserFollowers(login, callback) {
  userSchema.findOne({login: login}, async (err, user) => {
    let followers = user.followers;
    let ans = [];
    for (let i = 0; i < followers.length; i++) {
      let single = await getAUser(followers[i]);
      ans.push(single);
    }
    callback(ans);
  })
}

function getUserFollowingsAndFollowersNum(login, callback) {
  userSchema.findOne({login: login}, (err, user) => {
    callback({
      followings: user.followings.length,
      followers: user.followers.length
    });
  })
}

export {evaluateRecommend, getUserFollowings, getUserFollowers, getUserFollowingsAndFollowersNum}

//getUserFollowingsAndFollowersNum()
//connect();
//evaluateRecommend('RickChem', 'lodash/lodash', 1);
