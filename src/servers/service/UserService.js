/**
 * Created by raychen on 16/8/15.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getAUser, getARepo} from '../logic/HandleRecommendLogic'
import {connect} from '../config'
import {getUserStarred} from '../api/github_user'
import {upsertRepo, updateWhenLogin} from '../logic/UpdateWhenLogin'

var async = require("async");

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

function addFeedback(login, feedback, callback){
  userSchema.update({login:login}, {$addToSet:{feedback:{time:(new Date()).toLocaleString(), content: feedback}}}, (err, res) => {
    console.log('add feedback!');
    console.log(res);
    callback(1);
  });
}

function getUserStarRepo(login, callback){
  getUserStarred(login, 1, [], true, -1, (stars) => {
    let met1 = [];
    for (let i = 0; i < stars.length; i++) {
      met1.push((call0) => {
        upsertRepo(stars[i], () => {
          console.log('new repo: ' + stars[i]);
          call0(null, 'done 0!');
        });
      });
    }
    async.parallel(met1, async (err, res) => {
      console.log(res);
      let ans = [];
      for (let i = 0; i < stars.length; i++) {
        let repo_det = await getARepo(stars[i]);
        ans.push(repo_det);
      }
      callback(ans);
    })
  });
}

function reloadUser(login, callback){
  let update = {
    $set: {
      level: 0,
      recommend: [],
      now_recommend: [],
      dislike: [],
    }
  };
  if (login == 'All'){
    userSchema.find({}, (err, users) => {
      let met0 = [];
      for(let i=0;i<users.length;i++){
        met0.push((call0) => {
          userSchema.update({login:users[i].login}, update, (err, res) => {
            console.log('reload user:'+users[i].login);
            console.log(res);
            updateWhenLogin(users[i].login);
            call0(null, 'update:'+users[i].login);
          })
        })
      }
      async.parallel(met0, async (err, res) => {
        console.log(res);
        callback();
      })
    })
  } else {
    userSchema.update({login:login}, update, (err, res) => {
      console.log('reload user:'+login);
      console.log(res);
      updateWhenLogin(login);
      callback();
    })
  }
}

export {evaluateRecommend, getUserFollowings, getUserFollowers, getUserFollowingsAndFollowersNum, addFeedback, getUserStarRepo, reloadUser}

//getUserFollowingsAndFollowersNum()
//connect();
//evaluateRecommend('RickChem', 'lodash/lodash', 1);
//getUserStarRepo('RickChem', (res) => {
//  console.log(res);
//});
