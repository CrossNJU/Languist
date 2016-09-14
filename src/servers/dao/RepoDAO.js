/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {connect} from '../config'

import {getPublicRepos, getUserStarred} from '../api/github_user'
import {upsertUser, upsertRepo, updateUserStars, updateUserRepos, updateUserJoinRepo} from '../logic/UpdateWhenLogin'
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
    let user = await getGithubUserInfo(login);
    if (user.star_repos.length == 0){
        updateUserStars(login, true, async (stars) => {
          resolve(stars);
        });
    }else resolve(user.star_repos);
  });
  return t;
}

async function getPublicRepoByUser(login) {
  let t = await new Promise(async function (resolve, reject) {
    let user = await getGithubUserInfo(login);
    if (user.repos.length == 0){
      updateUserRepos(login, true, (repos) =>{
        resolve(repos);
      })
    }else resolve(user.repos);
  });
  return t;
}

async function getJoinRepoByUser(login) {
  let t = await new Promise(async function (resolve, reject) {
    let user = await getGithubUserInfo(login);
    if (user.joinRepos.length == 0){
      updateUserJoinRepo(login, true, (repos) =>{
        resolve(repos);
      })
    }else resolve(user.joinRepos);
  });
  return t;
}

async function getTopRepos(repo_num){
  let t = await new Promise(async function (resolve, reject) {
    github_repoSchema.find({}, (err, res) => {
      if (err) reject(err);
      let ans = [];
      for (let repo of res) {
        ans.push(repo.full_name);
        ans.push(repo.stars_count);
      }
      resolve(ans);
    }).sort({'stars_count': -1}).limit(repo_num);
  });
  return t;
}

export {getStarRepoByUser, getPublicRepoByUser, getRepoInfo,
  getJoinRepoByUser,getTopRepos}

async function test() {
  //connect();
  let t = await getGithubUserInfo("chenmuen");
  console.log(t);
  //github_userSchema.findOne({login:'chenmuen'}, (err, user) => {
  //  console.log(user);
  //})
}

//test();
