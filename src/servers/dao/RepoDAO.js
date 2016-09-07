/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {connect} from '../config'

import {getPublicRepos, getUserStarred} from '../api/github_user'
import {upsertUser, upsertRepo, updateUserStars, updateUserRepos} from '../logic/UpdateWhenLogin'
import {getGithubUserInfo} from './UserDAO'

async function getRepoInfo(fullname){
  let t = await new Promise(function(resolve, reject) {
    github_repoSchema.findOne({full_name: fullname}, (err, repo_single) => {
      if (err) reject(err);
      if (repo_single == null) {
        upsertRepo(fullname, () => {
          github_repoSchema.findOne({full_name: fullname}, (err, repo_single2) => {
            resolve(repo_single2);
          })
        })
      }else
        resolve(repo_single);
    });
  });
  return t;
}

async function getStarRepoByUser(login) {
  let t = await new Promise(async function (resolve, reject) {
    let ans = [];
    //console.log(login);
    let user = await getGithubUserInfo(login);
    let user_stars = user.star_repos;
    if (user_stars.length == 0){
      user_stars = await new Promise(function(resolve2, reject2){
        updateUserStars(login, true, async (stars) => {
          resolve2(stars);
        });
      })
    }
      for (let repo of user_stars){
        let repo_det = await getRepoInfo(repo);
        ans.push({
          fullname: repo,
          stars: repo_det.stars_count
        })
      }
      resolve(ans);
  });
  return t;
}

async function getPublicRepoByUser(login) {
  let t = await new Promise(async function (resolve, reject) {
    let user = await getGithubUserInfo(login);
    if (user.repos.length == null){
      updateUserRepos(login, true, (repos) =>{
        resolve(repos);
      })
    }else resolve(user.repos);
  });
  return t;
}

//async function getJoinRepoByUser(login) {
//  let t = await new Promise(function (resolve, reject) {
//    let user = getGithubUserInfo(login);
//    if (user.repos.length == null){
//      updateUserRepos(login, true, (repos) =>{
//        resolve(repos);
//      })
//    }else resolve(user.repos);
//  });
//  return t;
//}

export {getStarRepoByUser, getPublicRepoByUser, getRepoInfo}//, getJoinRepoByUser}

async function test() {
  connect();
  let t = await getRepoInfo("jceb/vim-orgmode");
  console.log(t);
}

//test();
