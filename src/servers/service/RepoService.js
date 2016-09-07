/**
 * Created by raychen on 16/9/7.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {get_rec_repos_by_contributor} from '../logic/RecommendLogic_repos'

function addARepoToSet(login, full_name, set_name, callback) {
  github_userSchema.findOne({login: login}, (err, user) => {
    let index = user.star_repos.findIndex(j => j == full_name);
    if (index < 0) callback(-1);
    else {
      userSchema.findOne({login: login}, (err, single) => {
        let sets = single.repo_sets;
        let index2 = sets.findIndex(j => j.set_name == set_name);
        if (index2 < 0) callback(-2);
        else {
          sets[index2].set_repos.push(full_name);
          userSchema.update({login: login}, {$set: {repo_sets: sets}}, (err, res) => {
            console.log('add repo:' + full_name + ' to repo set:' + set_name);
            console.log(res);
            callback(1);
          })
        }
      })
    }
  });
}

function addAReopSet(login, set_name, callback) {
  userSchema.findOne({login: login}, (err, user) => {
    let sets = user.repo_sets;
    let index = sets.findIndex(j => j.set_name == set_name);
    if (index >= 0) callback(-1);
    else {
      sets.push({
        set_name: set_name,
        set_repos: []
      });
      userSchema.update({login: login}, {$set: {repo_sets: sets}}, (err, res) => {
        console.log('add repo set:' + set_name);
        console.log(res);
        callback(1);
      })
    }
  })
}

function getRelatedRecommend(full_name){
  let rec_num = 10;
  let recs = get_rec_repos_by_contributor(full_name, rec_num);
  return recs;
}

export {addAReopSet, addARepoToSet, getRelatedRecommend}

//getRelatedRecommend('')
