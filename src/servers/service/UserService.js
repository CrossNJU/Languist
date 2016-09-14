/**
 * Created by raychen on 16/8/15.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getAUser, getARepo} from '../logic/HandleRecommendLogic'
import {connect} from '../config'
import {getUserStarred, getJoinRepos} from '../api/github_user'
import {upsertRepo, updateWhenLogin} from '../logic/UpdateWhenLogin'
import {record_log} from '../service/LogService'

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
      //console.log(res);
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

function addFeedback(login, feedback, callback) {
  userSchema.update({login: login}, {
    $addToSet: {
      feedback: {
        time: (new Date()).toLocaleString(),
        content: feedback
      }
    }
  }, (err, res) => {
    console.log('add feedback!');
    //console.log(res);
    callback(1);
  });
}

function getUserStarRepo(login, callback) {
  github_userSchema.findOne({login: login}, async (err, user) => {
    if (user.star_repo_all == 1) {
      let stars = user.star_repos;
      let ans = [];
      for (let i = 0; i < stars.length; i++) {
        let repo_det = await getARepo(stars[i]);
        ans.push(repo_det);
      }
      callback(ans);
    } else {
      getUserStarred(login, 1, [], true, -1, (stars) => {
        let met1 = [];
        for (let i = 0; i < stars.length; i++) {
          met1.push((call0) => {
            upsertRepo(stars[i], () => {
              //console.log('new repo: ' + stars[i]);
              call0(null, 'done 0!');
            });
          });
        }
        async.parallel(met1, async (err, res) => {
          record_log('system', 'get user: ' + login + ' star repos', 'done');
          console.log(res + 'get star repos');
          github_userSchema.update({login: login}, {$set: {star_repo_all: 1, star_repos: stars}}, (err, res) => {
            console.log('update user:' + login + ' star all repos');
            console.log(res);
          });
          let ans = [];
          for (let i = 0; i < stars.length; i++) {
            let repo_det = await getARepo(stars[i]);
            ans.push(repo_det);
          }
          callback(ans);
        })
      });
    }
  });
}

function reloadUser(login, callback) {
  //console.log('in');
  let update = {
    $set: {
      recommend: [],
      now_recommend: [],
      dislike: [],
    }
  };
  if (login == 'All') {
    userSchema.find({}, (err, users) => {
      //console.log(users);
      let met0 = [];
      for (let i = 0; i < users.length; i++) {
        met0.push((call0) => {
          userSchema.update({login: users[i].login}, update, (err, res) => {
            //console.log('reload user:'+users[i].login);
            //console.log(res);
            updateWhenLogin(users[i].login);
            //console.log('at');
            call0(null, 'update:' + users[i].login);
          })
        })
      }
      async.parallel(met0, async (err, res) => {
        record_log('system', 'reload all user', 'later');
        console.log(res);
        callback();
      })
    })
  } else {
    userSchema.update({login: login}, update, (err, res) => {
      record_log('system', 'reload user:' + login, 'later');
      console.log(res + 'reload user');
      updateWhenLogin(login);
      callback();
    })
  }
}

function getBestSubRepo(login, callback) {
  github_userSchema.findOne({login: login}, async (err, user) => {
    if (user.join_repo_all == 1) {
      let joins = user.joinRepos;
      let ans = [];
      for (let i = 0; i < joins.length; i++) {
        let repo_det = await getARepo(joins[i]);
        ans.push(repo_det);
      }
      ans.sort((o1, o2) => {
        return o2.star - o1.star;
      });
      let ret = [];
      if (ans[0].star < 1000) ret[0] = ans[0];
      else {
        let i = 0;
        while (i < 5 && ans[i].star >= 1000) {
          ret[i] = ans[i];
          i++;
        }
      }
      callback(ret);
    } else {
      getJoinRepos(login, 1, [], true, -1, (repos) => {
        console.log(repos);
        let met1 = [];
        for (let i = 0; i < repos.length; i++) {
          met1.push((call0) => {
            upsertRepo(repos[i], () => {
              //console.log('new repo: ' + stars[i]);
              call0(null, 'done 0!');
            });
          });
        }
        async.parallel(met1, async (err, res) => {
          record_log('system', 'get user: ' + login + ' subscribe repos', 'done');
          console.log(res + 'get subscribe repos');
          github_userSchema.update({login: login}, {$set: {join_repo_all: 1, joinRepos: repos}}, (err, res) => {
            console.log('update user:' + login + ' join all repos');
            console.log(res);
          });
          let ans = [];
          for (let i = 0; i < repos.length; i++) {
            let repo_det = await getARepo(repos[i]);
            ans.push(repo_det);
          }
          ans.sort((o1, o2) => {
            return o2.star - o1.star;
          });
          let ret = [];
          if (ans[0].star < 1000) ret[0] = ans[0];
          else {
            let i = 0;
            while (i < 5 && ans[i].star >= 1000) {
              ret[i] = ans[i];
              i++;
            }
          }
          callback(ret);
        })
      });
    }
  });
}

function isLanguist(login, callback) {
  userSchema.findOne({login: login}, (err, res) => {
    if (res == null) callback(false);
    else callback(true);
  })
}

export {evaluateRecommend, getUserFollowings, getUserFollowers, getUserFollowingsAndFollowersNum, addFeedback, getUserStarRepo, getBestSubRepo,isLanguist,  reloadUser}

//getUserFollowingsAndFollowersNum()
//connect();
//evaluateRecommend('RickChem', 'lodash/lodash', 1);
//getUserStarRepo('RickChem', (res) => {
//  console.log(res);
//});
//let a = [{a: 2}, {a: 4}, {a: 1}];
//a.sort((o1, o2)=> {
//  return o1.a - o2.a;
//});
//console.log(a);
//getUserStarRepo('ziadoz', (repos) => {
//  console.log(repos);
//});
//isLanguist('RickChem', (ans) => {console.log(ans)});
