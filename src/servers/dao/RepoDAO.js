/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {connect_callback} from '../config'

async function getStarRepoByUser(login){
  let t = await new Promise(function (resolve, reject) {
    userSchema.findOne({login: login}, async (err, user) => {
      if (err) reject(err);
      let ans = [];
      for (let repo of user.star_repos){
        let repo_det = await new Promise(function(resolve2, reject2) {
          github_repoSchema.findOne({full_name: repo}, (err, repo_one) => {
            if (err) reject2(err);
            resolve2(repo_one.stars_count);
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

export {getStarRepoByUser, getUserAndLevelByLanguage}

async function test(){
  connect_callback(async (v) => {
    if (v == 1){
      let t = await getStarRepoByUser("RickChem");
      console.log(t);
    }
  });
}

test();
