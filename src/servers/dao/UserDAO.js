/**
 * Created by raychen on 16/8/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
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
    github_userSchema.findOne({login: login}, (err, user) => {
      resolve(user.followings_login);
    });
  });
  return t;
}

async function getStarUserByRepo(full_name) {
  let t = await new Promise(function (resolve, reject) {
    github_repoSchema.findOne({full_name: full_name}, (err, repo) => {
      if (repo == null) resolve(null);
      else resolve(repo.starers);
    });
  });
  return t;
}

async function getContributorsByRepo(full_name) {
  let t = await new Promise(function (resolve, reject) {
    github_repoSchema.findOne({full_name: full_name}, (err, repo) => {
      resolve(repo.contributors);
    });
  });
  return t;
}

export {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo}

async function test() {
  let t = await getContributorsByRepo("CrossNJU/PASS");
  console.log(t);
}

//test();
