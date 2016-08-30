/**
 * Created by raychen on 16/7/19.
 */

import {github_repoSchema} from '../../models/github_repoSchema';
import {github_userSchema} from '../../models/github_userSchema'
import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema';
import {transTime} from '../util/timeUtil'
import {get_rec_languages} from '../logic/RecommendLogic_languages'
import {get_rec_repos_by_following, get_rec_repos_by_user} from '../logic/RecommendLogic_repos'
import {get_rec_users} from '../logic/RecommendLogic_users'
import {connect} from '../config'

async function combine(repos, users, langs){
  let ans = [];
  for (let lang of langs){
    let single = await new Promise(function(resolve, reject) {
      languageSchema.findOne({language: lang}, (err, lang_single) => {
        if (err) reject(err);
        let ret = {
          type: 'lang',
          name: lang,
          description: lang_single.wiki
        };
        resolve(ret);
      });
    });
    ans.push(single);
  }
  for (let user of users){
    let single = await new Promise(function(resolve, reject) {
      userSchema.findOne({login: user}, (err, user_single) => {
        if (err) reject(err);
        let lang_user = [];
        for (let lang_single of user_single.language){
          lang_user.push(lang_single.lang_name);
        }
        github_userSchema.findOne({login: user}, (err, github_user) => {
          let ret = {
            type: 'user',
            avatarUrl: github_user.avatar_url,
            login: user_single.login,
            name: github_user.name,
            bio: github_user.bio,
            url: github_user.blog,
            langs: lang_user,
            join: github_user.created_at,
            location: github_user.location,
            follwers: github_user.followers
          };
          resolve(ret);
        });
      });
    });
    ans.push(single);
  }
  for (let repo of repos){
    let single = await new Promise(function(resolve, reject) {
      github_repoSchema.findOne({full_name: repo}, (err, repo_single) => {
        if (err) reject(err);
        let ret = {
          type: 'repo',
          avatarUrl: repo_single.owner_avatar_url,
          owner: repo_single.owner,
          name: repo_single.full_name.split("/")[1],
          description: repo_single.description,
          tags: repo_single.languages,
          update: transTime(repo_single.updated_at),
          star: repo_single.stars_count
        };
        resolve(ret);
      });
    });
    ans.push(single);
  }
  return ans;
}

export var getCoverData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=> {
    data.langs = user.language.length;
    github_userSchema.findOne(condition, (err, user_git) => {
      data.avatar_url = user_git.avatar_url;
      data.name = user_git.login;
      callback(data);
    });
  });
};

export var getCountData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  github_userSchema.findOne(condition, (err, user) => {
    if (err) {
      console.log('err occurs: ' + err.message);
    } else {
      data.followingCount = user.following;
      data.followersCount = user.followers;
      data.starredCount = user.star_num;
      callback(data);
    }
  });
};

export var getLangListData = (userName, callback) => {
  let data = [];
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=>{
    let langs = user.language;
    for (let i=0;i<langs.length;i++){
      data[i] = {};
      data[i].name = langs[i].lang_name;
      data[i].level = langs[i].lang_level;
    }
    callback(data);
  });
};

async function getFlowListData(userName, callback) {
  //getRepoByUser(userName, language, async (repos) => {
  //  let ans = [];
  //  if (repos.length > 0){
  //    for (let i=0;i<repos.length;i++){
  //      let full_name = repos[i];
  //      let repo_single = await new Promise((resolve, reject) => {
  //        github_repoSchema.findOne({"full_name": full_name}, (err, repo_sing) => {
  //          if (err){
  //            reject(err);
  //          }else {
  //            resolve(repo_sing);
  //          }
  //        });
  //      });
  //      let update_time = transTime(repo_single.updated_at);
  //      ans[i] = {
  //        //type:
  //        avatarUrl: repo_single.owner_avatar_url,
  //        owner: repo_single.owner,
  //        name: full_name.split("/")[1],
  //        description: repo_single.description,
  //        tags: repo_single.languages,
  //        update: update_time,
  //        star: repo_single.stars_count,
  //        url: repo_single.url
  //      };
  //    }
  //  }
  //  callback(ans);
  //});
  //console.log("in");
  let repos = await get_rec_repos_by_user(userName, 10);
  //console.log("repo return");
  let langs = await get_rec_languages(userName, 5);
  //console.log("lang return");
  let users = await get_rec_users(userName, 5);
  //console.log("user return");
  let ans = await combine(repos, users, langs);
  callback(ans);
}

export {getFlowListData}

//connect();
//getFlowListData("RickChem", res => {
//  console.log("ok");
//});
