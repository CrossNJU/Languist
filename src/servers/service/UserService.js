/**
 * Created by raychen on 16/8/15.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getAUser} from '../logic/HandleRecommendLogic'

function evaluateRecommend(login, name, type, like) {
  userSchema.findOne({login: login}, (err, user) => {
    let rec = user.recommend;
    let index = rec.findIndex(j => {
      return (j.m_type == type) && (j.m_name == name)
    });
    rec[index].m_like = like;
    userSchema.update({login: login}, {$set: {recommend: rec}}, (err, res) => {
      console.log('update recommend feedback!');
      console.log(res);
    })
  });
}

function getUserFollowings(login, callback) {
  github_userSchema.findOne({login: login}, async (err, user) => {
    let followings = user.followings_login;
    let ans = [];
    for (let i = 0; i < followings.length; i++) {
      let single = await getAUser(followings[i]);
      ans.push(single);
    }
    callback(ans);
  })
}

function getUserFollowingsAndFollowersNum(login, callback){
  github_userSchema.findOne({login: login}, async (err, user) => {
    callback({
      followings: user.followings_count,
      followers: user.followers_count
    });
  })
}

export {evaluateRecommend, getUserFollowings, getUserFollowingsAndFollowersNum}
