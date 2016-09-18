/**
 * Created by raychen on 16/9/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'

function getAllUserInfo(callback){
  let ans = [];
  userSchema.find({}, (err, users) => {
    for (let i=0;i<users.length;i++){
      let user = users[i];
      ans.push({
        login: user.login,
        star_repos: user.star_repos.length,
        language: user.language,
        recommend: user.recommend.length,
        rec_date: user.rec_date,
        repo_sets: user.repo_sets.length,
        now_recommend: user.now_recommend.length,
        dislike: user.dislike,
        feedback: user.feedback
      });
    }
    callback(ans);
  });
}

function getUserInfo(login, callback){
  userSchema.findOne({login: login}, (err, user)=>{
    callback(user);
  });
}

export {getAllUserInfo, getUserInfo}
