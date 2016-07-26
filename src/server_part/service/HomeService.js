/**
 * Created by raychen on 16/7/19.
 */

import github_userSchema from '../../models/github_userSchema';
import language from '../../models/languageSchema';

import {getRepoByUser} from '../logic/RecommendLogic_lang'

export var getCountData = (userName, callback) => {
  let data = {};
  github_userSchema
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
  github_userSchema
    .findOne({name: userName})
    .exec((err, user) => {
      let langs = user.language;
      let i = 0;
      for (let l of langs){
        language
          .findOne({_id: l.language_id})
          .exec((err, language) => {
            data[i] = {name: language.name, level: l.level}
          });
        i ++;
      }
      callback(data);
    });
};

export var getRepoListData = (userName, language, callback) => {
  getRepoByUser(userName, language, callback);
};
