/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {connect_callback} from '../config'

async function getStarRepoByUser(login){
  let t = await new Promise(function (resolve, reject) {
    let ans = [];
    userSchema.findOne({login: login}, (err, user) => {
      if (err) reject(err);
      ans = user.star_repos;
      resolve(ans);
    });
  });
  return t;
}

async function test(){
  connect_callback(async (v) => {
    if (v == 1){
      let t = await getStarRepoByUser("RickChem");
      console.log(t);
    }
  });
}

test();
