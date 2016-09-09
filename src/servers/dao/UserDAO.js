/**
 * Created by raychen on 16/8/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {connect_callback} from '../config'

import {getFollowings} from '../api/github_user'
import {getStarredUsers, getContributors} from '../api/github_repo'
import {upsertUser, updateUserFollowing, updateRepoStar} from '../logic/UpdateWhenLogin'
import {getRepoInfo} from './RepoDAO'

async function getGithubUserInfo(login){
  let t = await new Promise(function(resolve, reject) {
    github_userSchema.findOne({login:login}, (err, user) => {
      if (err) reject(err);
      if (user == null) {
        upsertUser(login, () => {
          github_userSchema.findOne({login:login}, (err, user2) => {
            resolve(user2)
          })
        })
      }else resolve(user);
    });
  });
  return t;
}

async function getUserLanguage(login){
  let t = await new Promise((resolve, reject) => {
    userSchema.findOne({login:login}, (err, user) => {
      if (user == null) resolve(null);
      else resolve(user.languages);
    });
  });
  return t;
}

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
  let t = await new Promise(async function (resolve, reject) {
    let user = await getGithubUserInfo(login);
    if (user.followings_login.length == 0){
      updateUserFollowing(login, (follows) => {
        resolve(follows);
      })
    }else {
      resolve(user.followings_login);
    }
  });
  return t;
}

async function getStarUserByRepo(full_name) {
  let t = await new Promise(async function (resolve, reject) {
    let repo = await getRepoInfo(full_name);
    if (repo.starers.length == 0){
      updateRepoStar(full_name, (stars) => {
        resolve(stars);
      })
    }else {
      resolve(repo.starers);
    }
  });
  return t;
}

async function getContributorsByRepo(full_name) {
  let t = await new Promise(async function (resolve, reject) {
    let repo = await getRepoInfo(full_name);
    if (repo.contributors.length == 0){
      updateRepoStar(full_name, (contributors) => {
        resolve(contributors);
      })
    }else {
      resolve(repo.contributors);
    }
  });
  return t;
}

export {getGithubUserInfo, getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo, getUserLanguage}

async function test() {
  let t = await getRepoInfo("CrossNJU/PASS");
  console.log(t);
}

//test();
