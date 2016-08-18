/**
 * Created by raychen on 16/8/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {connect_callback} from '../config'

import {getFollowings} from '../api/github_user'
import {getStarredUsers, getContributors} from '../api/github_repo'

function findLevel(user, langName){
  for (let lang of user.language){
    if (lang.lang_name == langName) return lang.lang_level;
  }
  return -1;
}

async function getUserAndLevelByLanguage(language){
  //暂时用最简单的取出全部用户
  let promise = await new Promise(function(resolve, reject){
    userSchema.find({}, (err, users) => {
      if (err) reject(err);
      let ans = [];
      for (let user of users){
        let level = findLevel(user, language);
        if (level>=0)
          ans.push({
            login: user.login,
            lan_level: level
          })
      }
      resolve(ans);
    });
  });
  return promise;
}

async function getFollowingByUser(login) {
  let t = await new Promise(function (resolve, reject) {
    getFollowings(login, 1, [], (users) => {
      resolve(users);
    });
  });
  return t;
}

async function getStarUserByRepo(full_name) {
  let t = await new Promise(function (resolve, reject) {
    getStarredUsers(full_name, 1, [], (users) => {
      resolve(users);
    });
  });
  return t;
}

async function getContributorsByRepo(full_name) {
  let t = await new Promise(function (resolve, reject) {
    getContributors(full_name, 1, [], (users) => {
      resolve(users);
    });
  });
  return t;
}

export {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo}

async function test() {
  let t = await getContributorsByRepo("CrossNJU/PASS");
  console.log(t);
}

test();
