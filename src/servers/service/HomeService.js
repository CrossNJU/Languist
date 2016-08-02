/**
 * Created by raychen on 16/7/19.
 */

import {github_repoSchema} from '../../models/github_repoSchema';
import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema';
import {getRepoByUser} from '../logic/RecommendLogic_lang';
import {transTime} from '../util/timeUtil'

export var getCoverData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=> {
    data.avatar_url = user.avatar_url;
    data.name = user.login;
    data.langs = user.language.length;
    callback(data);
  });
};

export var getCountData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user) => {
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

export var getRepoListData = (userName, language, callback) => {
  getRepoByUser(userName, language, async (repos) => {
    let ans = [];
    if (repos.length > 0){
      for (let i=0;i<repos.length;i++){
        let full_name = repos[i];
        let repo_single = await new Promise((resolve, reject) => {
          github_repoSchema.findOne({"full_name": full_name}, (err, repo_sing) => {
            if (err){
              reject(err);
            }else {
              resolve(repo_sing);
            }
          });
        });
        let update_time = transTime(repo_single.updated_at);
        ans[i] = {
          avatarUrl: repo_single.owner_avatar_url,
          owner: repo_single.owner,
          name: full_name.split("/")[1],
          description: repo_single.description,
          tags: repo_single.languages,
          update: update_time,
          star: repo_single.stars_count,
          url: repo_single.url
        };
      }
    }
    callback(ans);
  });
};
