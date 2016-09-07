/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {connect} from '../config'

import {getPublicRepos, getUserStarred} from '../api/github_user'

async function getRepoInfo(fullname){
  let t = await new Promise(function(resolve, reject) {
    github_repoSchema.findOne({full_name: fullname}, (err, repo_single) => {
      if (err) reject(err);
      resolve(repo_single);
    });
  });
  return t;
}

async function getStarRepoByUser(login) {
  let t = await new Promise(function (resolve, reject) {
    github_userSchema.findOne({login: login}, async (err, user) => {
      if (err) reject(err);
      let ans = [];
      for (let repo of user.star_repos){
        let repo_det = await new Promise(function(resolve2, reject2) {
          github_repoSchema.findOne({full_name: repo}, (err, repo_one) => {
            if (err) reject2(err);
            if (repo_one == null) resolve2(null);
            else resolve2(repo_one.stars_count);
          });
        });
        ans.push({
          fullname: repo,
          stars: repo_det
        })
      }
      resolve(ans);
    });
  });
  return t;
}

async function getPublicRepoByUser(login) {

  // console.log('inin');

  let t = await new Promise(function (resolve, reject) {
    github_userSchema.findOne({login: login}, async (err, user) => {
      if (err) reject(err);
      if (user == null) resolve(null);
      resolve(user.repos);
    });
  });

  // console.log('t');
  // console.log(t);

  return t;
}

export {getStarRepoByUser, getPublicRepoByUser, getRepoInfo}

async function test() {
  connect();
  let t = await getRepoInfo("jceb/vim-orgmode");
  console.log(t);
}

//test();
