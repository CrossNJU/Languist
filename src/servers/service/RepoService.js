/**
 * Created by raychen on 16/9/7.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {getRepoLanguages} from '../api/github_repo';
import {get_rec_repos_by_contributor, get_related_rec_repos} from '../logic/RecommendLogic_repos'
import {updateRepoCons, updateUserRepos, upsertUser, upsertRepo} from '../logic/UpdateWhenLogin'
import {getARepo, getDetail} from '../logic/HandleRecommendLogic'
import {connect, logger} from '../config'
import {record_log} from '../service/LogService'

var async = require('async');

function addARepoToSet(login, full_name, set_name, callback) {
  github_userSchema.findOne({login: login}, (err, user) => {
    let index = user.star_repos.findIndex(j => j == full_name);
    if (index < 0) callback(-1);
    else {
      userSchema.findOne({login: login}, (err, single) => {
        let sets = single.repo_sets;
        for (let i = 0; i < sets.length; i++) {
          let repos = sets[i].set_repos;
          let index3 = repos.findIndex(j => j == full_name);
          if (index3 >= 0) {
            sets[i].set_repos.splice(index3, 1);
          }
        }
        let index2 = sets.findIndex(j => j.set_name == set_name);
        if (index2 < 0) callback(-2);
        else {
          sets[index2].set_repos.push(full_name);
          userSchema.update({login: login}, {$set: {repo_sets: sets}}, (err, res) => {
            logger.info('add repo:' + full_name + ' to repo set:' + set_name);
            //console.log(res);
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
        logger.info('add repo set:' + set_name);
        //console.log(res);
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
  logger.info('start related repos for: '+ full_name);
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
                    //console.log('done from REPO contributor: ' + contributors[i] + ' to its repo: ' + repos[j] + '!');
                    call2(null, 'done 2!');
                  })
                });
              }
              async.parallel(met2, (err, res) => {
                //console.log(res);
                call1(null, 'done 1!');
              });
            })
          })
        });
      }
      async.parallel(met1, (err, res) => {
        //console.log(res);
        call0(null, 'done 0!');
      });
    })
  });
  async.parallel(met0, (err, res) => {
    logger.info(res + 'get related repo info for: '+ full_name);
    record_log('system', 'done get related repo data for: ' + full_name, 'done');
    callback();
  })
}

async function getRelatedRecommend(full_name, callback) {
  github_repoSchema.findOne({full_name: full_name}, async (err, repo) => {
    if (repo == null){
      upsertRepo(full_name, () => {
        getRelatedRecommend(full_name, callback);
      });
    }else if (repo.related.length != 0) {
      let ans = [];
      for (let i = 0; i < repo.related.length; i++) {
        let repo_det = await getARepo(repo.related[i]);
        ans.push(repo_det);
      }
      //console.log(ans);
      callback(ans);
    } else {
      updateSingleRepoRecommend(full_name, async ()=> {
        let rec_num = 10;
        console.log('in');
        let recs = await get_related_rec_repos(full_name,1,1);
        if (recs == null){
          recs = await get_rec_repos_by_contributor(full_name, rec_num);
        }
        console.log(recs);
        github_repoSchema.update({full_name: full_name}, {$set: {related: recs}}, (err, res) => {
          //console.log('update a repo:' + full_name + ' related!');
          //console.log(res);
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

async function getRepoInfos(full_name, callback) {
  let ans = await getARepo(full_name);
  callback(ans);
}

function addMore(login, timesBefore, callback) {
  userSchema.findOne({login: login}, async (err, user) => {
    let rec_all = user.recommend;
    let ans = [];
    for (let i = 0; i < rec_all.length; i++) {
      if (rec_all[i].m_date == timesBefore) ans.push({m_name: rec_all[i].m_name, m_type: rec_all[i].m_type});
    }
    let t = await getDetail(ans);
    callback(t);
  });
}

async function addInfoToList(login, flowlist, include_user, callback) {
  let user = await new Promise((resolve, reject) => {
    userSchema.findOne({login: login}, (err, user) => {
      resolve(user);
    });
  });
  let sets = user.repo_sets;
  let followings = user.followings;
  for (let i = 0; i < flowlist.length; i++) {
    if (flowlist[i].type == 'repo') {
      let full_name = flowlist[i].full_name;
      let ans = [];
      for (let j = 0; j < sets.length; j++) {
        let index = sets[j].set_repos.findIndex(k => k == full_name);
        if (index >= 0) ans.push(sets[j].set_name);
      }
      flowlist[i].set = ans;
    } else if (include_user && flowlist[i].type == 'user') {
      let is_following = false, is_languist = false;
      let index = followings.findIndex(j => j == flowlist[i].login);
      if (index >= 0) is_following = true;
      let test = await new Promise((resolve, reject) => {
        userSchema.findOne({login: flowlist[i].login}, (err, user)=> {
          resolve(user);
        })
      });
      if (test != null) is_languist = true;
      flowlist[i].isFollowing = is_following;
      flowlist[i].isLanguist = is_languist;
    }
  }
  callback();
}

function getRepoLanguage(full_name, callback) {
  logger.debug('in get repo: '+ full_name+' language...');
  github_repoSchema.findOne({full_name: full_name}, (err, repo) => {
    if (repo == null){
      getRepoLanguages(full_name, (languages) => {
        if (languages.length > 3) callback(languages.slice(0,3));
        else callback(languages);
      });
    } else if (repo.languages.length == 0){
      getRepoLanguages(full_name, (languages) => {
        let conditions = {full_name: full_name};
        let update = {
          $set: {
            languages: languages
          }
        };
        github_repoSchema.update(conditions, update, (err, res) => {
          logger.debug('update repo:' + full_name + ' languages');
          logger.debug(res);
          if (languages.length > 3) callback(languages.slice(0,3));
          else callback(languages);
        });
      });
    } else {
      if (repo.languages.length > 3) callback(repo.languages.slice(0,3));
      else callback(repo.languages);
    }
  });
}

export {addAReopSet, addARepoToSet, getRepoSet, getRepoSetList, getRelatedRecommend, getRepoInfos, addMore, addInfoToList, getRepoLanguage}

//userSchema.update({login:'RickChem'}, {$set:{repo_sets: [{set_name:'test1', set_repos:['DanARay/mineSnake', 'DanARay/wordsReader']}]}}, (err, res)=> {
//  console.log(res);
//});
//getRepoSet('RickChem', 'test1', (ret) => {
//  console.log(ret);
//});

//connect();
//getRelatedRecommend('pixijs/pixi.js', (repos) => {
//  console.log(repos);
//});

//addMore('RickChem', -3, (ret) => {
//  console.log(ret);
//});

//addARepoToSet('RickChem', 'jquery/jquery', 'test', (res)=> {
//  console.log(res);
//});

//getRepoLanguage('postmodern/ruby-install', (langs) => {
// console.log(langs);
//});
