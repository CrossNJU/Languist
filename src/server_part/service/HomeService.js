/**
 * Created by raychen on 16/7/19.
 */

import github_userSchema from '../../models/github_userSchema';
import userSchema from '../../models/userSchema'
import language from '../../models/languageSchema';
import {getRepoByUser} from '../logic/RecommendLogic_lang'

export var getCoverData = (userName, callback) => {
  let data = {};
  let condition = {login: userName};
  userSchema.findOne(condition, (err, user)=> {
    data.avatar_url = user.avatar_url;
    data.name = user.name;
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
          repoSchema.findOne({"fullname": full_name}, 'avatar_url description tags update_time star_num', (err, repo_sing) => {
            if (err){
              reject(err);
            }else {
              resolve(repo_sing);
            }
          });
        });
        ans[i] = {
          avatarUrl: repo_single.avatar_url,
          owner: repo_single.owner,
          name: full_name.split("/")[1],
          description: repo_single.description,
          tags: repo_single.tags,
          update: repo_single.update_time,
          star: repo_single.star_num,
          url: repo_single.url
        };
      }
    }
    callback(ans);
  });
};
