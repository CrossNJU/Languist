/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {connect_callback} from '../config'

import {getPublicRepos, getUserStarred} from '../api/github_user'

//**local get starred repos**
//userSchema.findOne({login: login}, async (err, user) => {
//  if (err) reject(err);
//  let ans = [];
//  for (let repo of user.star_repos){
//    let repo_det = await new Promise(function(resolve2, reject2) {
//      github_repoSchema.findOne({full_name: repo}, (err, repo_one) => {
//        if (err) reject2(err);
//        resolve2(repo_one.stars_count);
//      });
//    });
//    ans.push({
//      fullname: repo,
//      stars: repo_det
//    })
//  }
//  resolve(ans);
//});

async function getStarRepoByUser(login) {
  let t = await new Promise(function (resolve, reject) {
    getUserStarred(login, 1, [], (repos) => {
      resolve(repos);
    });
  });
  return t;
}

async function getPublicRepoByUser(login) {
  let t = await new Promise(function (resolve, reject) {
    getPublicRepos(login, 1, [], (repos) => {
      resolve(repos);
    });
  });
  return t;
}

export {getStarRepoByUser, getPublicRepoByUser}

async function test() {
  let t = await getPublicRepoByUser("RickChem");
  console.log(t);
}

//test();
