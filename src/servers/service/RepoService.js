/**
 * Created by raychen on 16/9/7.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {get_rec_repos_by_contributor} from '../logic/RecommendLogic_repos'
import {updateRepoCons, updateUserRepos, upsertUser, upsertRepo} from '../logic/UpdateWhenLogin'
import {getARepo, getDetail} from '../logic/HandleRecommendLogic'

var async = require('async');

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

function getRepoSet(login, set_name, callback) {
  userSchema.findOne({login: login}, async (err, user) => {
    if (set_name == 'All') {
      let ans = [];
      let repos = user.star_repos;
      for (let i = 0; i < repos.length; i++) {
        let repo_det = await getARepo(repos[i]);
        ans.push(repo_det);
      }
      callback(ans);
    } else {
      let sets = user.repo_sets;
      let index = sets.findIndex(j => j.set_name == set_name);
      if (index < 0) callback(-1);
      else {
        let ans = [];
        let repos = sets[index].set_repos;
        for (let i = 0; i < repos.length; i++) {
          let repo_det = await getARepo(repos[i]);
          ans.push(repo_det);
        }
        callback(ans);
      }
    }
  })
}

function getRepoSetList(login, callback) {
  userSchema.findOne({login: login}, (err, user) => {
    let ans = [];
    for (let i = 0; i < user.repo_sets.length; i++) {
      ans.push({
        setName: user.repo_sets[i].set_name,
        repoNum: user.repo_sets[i].set_repos.length
      });
    }
    callback(ans);
  })
}

function updateSingleRepoRecommend(full_name, callback) {
  let met0 = [];
  met0.push((call0) => {
    updateRepoCons(full_name, (contributors) => {
      let met1 = [];
      for (let i = 0; i < contributors.length; i++) {
        met1.push((call1) => {
          upsertUser(contributors[i], () => {
            updateUserRepos(contributors[i], true, (repos) => {
              let met2 = [];
              for (let j = 0; j < repos.length; j++) {
                met2.push((call2) => {
                  upsertRepo(repos[j], () => {
                    console.log('done from REPO contributor: ' + contributors[i] + ' to its repo: ' + repos[j] + '!');
                    call2('done 2!');
                  })
                });
              }
              async.parallel(met2, (err, res) => {
                console.log(res);
                call1('done 1!');
              });
            })
          })
        });
      }
      async.parallel(met1, (err, res) => {
        console.log(res);
        call0('done 0!');
      });
    })
  });
  async.parallel(met0, (err, res) => {
    console.log(res);
    callback();
  })
}

async function getRelatedRecommend(full_name, callback) {
  github_repoSchema.findOne({full_name: full_name}, async (err, repo) => {
    if (repo.related.length != 0) {
      let ans = [];
      for (let i = 0; i < repo.related.length; i++) {
        let repo = await getARepo(repo.related[i]);
        ans.push(repo);
      }
      callback(ans);
    } else {
      updateSingleRepoRecommend(full_name, async ()=> {
        let rec_num = 10;
        let recs = await get_rec_repos_by_contributor(full_name, rec_num);
        github_repoSchema.update({full_name: full_name}, {$set: {related: recs}}, (err, res) => {
          console.log('update a repo:' + full_name + ' related!');
          console.log(res);
        });
        let ans = [];
        for (let i = 0; i < recs.length; i++) {
          let repo = await getARepo(recs[i]);
          ans.push(repo);
        }
        callback(ans);
      });
    }
  });
}

function getRepoInfos(full_name, callback){
  let ans = getARepo(full_name);
  callback(ans);
}

function addMore(login, timesBefore, callback){
  userSchema.findOne({login:login}, (err,user) => {
    let rec_all = user.recommend;
    let date_set = [];
    for (let i=0;i<rec_all.length;i++){
      let index = date_set.findIndex(j => j == rec_all[i].m_date);
      if (index < 0 && rec_all[i].m_date<0) date_set.push(rec_all[i].m_date);
    }
    date_set.sort((o1, o2) => {return o1<o2});
    if (timesBefore>date_set) callback([]);
    else {
      let ans = [];
      let date = date_set[timesBefore-1];
      for (let i=0;i<rec_all.length;i++){
        if (rec_all[i].m_date == date) ans.push({m_name:rec_all[i].m_date, m_type:rec_all[i].m_type});
      }
      callback(getDetail(ans));
    }
  });
}

export {addAReopSet, addARepoToSet, getRepoSet, getRepoSetList, getRelatedRecommend, getRepoInfos, addMore}

//userSchema.update({login:'RickChem'}, {$set:{repo_sets: [{set_name:'test1', set_repos:['DanARay/mineSnake', 'DanARay/wordsReader']}]}}, (err, res)=> {
//  console.log(res);
//});
//getRepoSet('RickChem', 'test1', (ret) => {
//  console.log(ret);
//});

