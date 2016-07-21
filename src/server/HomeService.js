/**
 * Created by raychen on 16/7/19.
 */

import repoDataService from '../models/repositorySchema';
import userDataService from '../models/userSchema';
import languageService from '../models/languageSchema';

export var getCountData = (userName, callback) => {
  let data = {};
  userDataService
    .findOne({login: userName})
    .exec((err, user) => {
      if (err) {
        console.log('err occurs: '+err.message);
      }else {
        data.followingCount = user.following_num;
        data.followersCount = user.follower_num;
        data.starredCount = user.starred_num;
        callback(data);
      }
    });
  //return data;
};

export var getLangListData = (userName) => {
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
    });
  return data;
};

export var getRepoListData = (userName, language) => {
  let data = {};

  return data;
};
