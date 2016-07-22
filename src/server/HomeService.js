/**
 * Created by raychen on 16/7/19.
 */

import repoDataService from '../models/repositorySchema';
import userDataService from '../models/userSchema';
import languageService from '../models/languageSchema';
import {getRepoByUser} from './RecommendLogic_lang'

export var getCountData = (userName, callback) => {
  let data = {};
  userDataService
    .findOne({login: userName})
    .exec((err, user) => {
      if (err) {
        console.log('err occurs: '+err.message);
      }else {
        data.followingCount = user.followings_num;
        data.followersCount = user.followers_num;
        data.starredCount = user.starred_num;
        callback(data);
      }
    });
};

export var getLangListData = (userName, callback) => {
  let data = [];
  userDataService
    .findOne({name: userName})
    .exec((err, user) => {
      let langs = user.language;
      let i = 0;
      for (let l of langs){
        languageService
          .findOne({_id: l.language_id})
          .exec((err, language) => {
            data[i] = {name: language.name, level: l.level}
          });
        i ++;
      }
      callback(data);
    });
};

//let sample = {
//  avatarUrl: '',
//  owner: 'facebook',
//  name: 'react',
//  description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces. https://facebook.github.io/react/',
//  tags: [
//    'JavaScript',
//    'Framework'
//  ],
//  update: 'July 11, 2016',
//  star: 2731
//}

function getRepoList(names,index,data,callback){
  if (index>=names.length) callback(data);
  else {
    repoDataService.findOne({fullname: names[index]}, (err, repo) => {
      let len = data.length;
      data[len] = {
        avatarUrl: '',
        owner: repo.owner,
        name: repo.fullname,
        description: repo.description,
        tags: repo.tags,
        update: repo.update_time,
        star: repo.star_num
      }
    });
  }
}

export var getRepoListData = (userName, language, callback) => {
  getRepoByUser(userName, language, (data) => {
    getRepoList(data, 0, [], val => callback(val));
  });
};
