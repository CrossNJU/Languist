/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'

async function getStarRepoByUser(login){
  let promise = await new Promise(function (resolve, reject) {
    let ans = [];
    userSchema.findOne({login: login}, (err, user) => {
      if (err) reject(err);
      ans = user.star_repos;
    });
    resolve(ans);
  });
  return promise;
}


