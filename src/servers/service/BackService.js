/**
 * Created by raychen on 16/9/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {my_userSchema} from '../../models/mysql-models/my_userSchema'
import {connect} from '../config'

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

//connect();
//my_userSchema.find({starred_count:{$gt: 100}, followers_count:{$gt: 100} }, (err, users)=>{
//  let ans = [];
//  let c = 0;
//  for (let i=0;i<users.length;i++){
//    if (users[i].email != 'Unknown' && users[i].email != null && c<20){
//      c++;
//      ans.push({
//        login: users[i].login,
//        email: users[i].email,
//        following: users[i].followings_count,
//        follower: users[i].followers_count,
//        star: users[i].starred_count
//      })
//    }
//  }
//  console.log(ans);
//});
