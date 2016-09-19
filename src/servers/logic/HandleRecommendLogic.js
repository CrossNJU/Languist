/**
 * Created by raychen on 16/9/6.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema';
import {github_userSchema} from '../../models/github_userSchema'
import {languageSchema} from '../../models/languageSchema';
import {transTime} from '../util/timeUtil'
import {get_rec_languages,get_rec_languages_by_repos} from './RecommendLogic_languages'
import {get_rec_repos,get_related_rec_repos,get_rec_repos_by_also_star} from './RecommendLogic_repos'
import {get_rec_users,get_rec_users_by_star_contributor,get_rec_users_when_zero,get_rec_users_by_language,get_rec_users_by_following_repo} from './RecommendLogic_users'
import {connect} from '../config'
import {record_log} from '../service/LogService'
import {upsertRepo, upsertUser, updateInitialInfo} from './UpdateWhenLogin'

var async = require("async");
var time_signal = 0;

//---------------------------  common function to get random index  --------------------------------------------------
function getRandomIndex(array_len, len) {
  if (len > array_len) return [];
  let index = [], ret = [];
  for (let i = 0; i < array_len; i++) index[i] = i;
  while (ret.length < len) {
    let r = parseInt(Math.random() * index.length);
    ret.push(index[r]);
    index.splice(r, 1);
  }
  return ret;
}

//---------------------------  common function to get detail  --------------------------------------------------
async function getDetail(array) {
  let ans = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].m_type == 0) {
      let single = await getAUser(array[i].m_name);
      ans.push(single);
    } else if (array[i].m_type == 1) {
      let single = await getARepo(array[i].m_name);
      ans.push(single);
    } else if (array[i].m_type == 2) {
      let single = await getALanguage(array[i].m_name);
      ans.push(single);
    }
  }
  return ans;
}


//---------------------------  fake data  --------------------------------------------------
async function fakeUsers(number) {
  return await new Promise(function (resolve, reject) {
    github_userSchema.find({}).limit(number).exec((err, res) => {
      let ret = [];
      for (let user of res) {
        ret.push(user.login);
      }
      //console.log(ret);
      resolve(ret);
    })
  })
}

async function fakeLangs(number) {
  return await new Promise(function (resolve, reject) {
    languageSchema.find({}).limit(number).exec((err, res) => {
      let ret = [];
      for (let lang of res) {
        ret.push(lang.language);
      }
      //console.log(ret);
      resolve(ret);
    })
  })
}

//---------------------------  get detail infomation of (repo,user,lang)  --------------------------------------------------
function getALanguage(lang) {
  return new Promise(function (resolve, reject) {
    languageSchema.findOne({language: lang}, (err, lang_single) => {
      if (err) reject(err);
      let ret = {
        type: 'lang',
        name: lang,
        description: lang_single.wiki
      };
      resolve(ret);
    });
  });
}

function getARepo(repo) {
  return new Promise(function (resolve, reject) {
    github_repoSchema.findOne({full_name: repo}, (err, repo_single) => {
      if (err) reject(err);
      //console.log('repo:' + repo);
      if (repo_single == null) {
        upsertRepo(repo, () => {
          resolve(getARepo(repo));
        });
      }
      else {
        let ret = {
          type: 'repo',
          avatarUrl: repo_single.owner_avatar_url,
          owner: repo_single.owner,
          name: repo_single.full_name.split("/")[1],
          description: repo_single.description,
          tags: repo_single.languages,
          update: transTime(repo_single.updated_at),
          star: repo_single.stars_count,
          full_name: repo
        };
        resolve(ret);
      }
    });
  });
}

function getAUser(user) {
  return new Promise(function (resolve, reject) {
    userSchema.findOne({login: user}, (err, user_single) => {
      //console.log('user:' + user);
      if (err) reject(err);
      let lang_user = [];
      if (user_single != null) {
        for (let lang_single of user_single.language) {
          lang_user.push(lang_single.lang_name);
        }
      }
      github_userSchema.findOne({login: user}, (err, github_user) => {
        //console.log(user);
        if (github_user == null) {
          upsertUser(user, () => {
            resolve(getAUser(user));
          });
        } else {
          let ret = {
            type: 'user',
            avatarUrl: github_user.avatar_url,
            login: user,
            name: github_user.name,
            bio: github_user.bio,
            url: github_user.blog,
            langs: lang_user,
            join: transTime(github_user.created_at),
            location: github_user.location,
            followers: github_user.followers
          };
          resolve(ret);
        }
      });
    });
  });
}

//---------------------------  random conbine (repo,user,lang)'s name --------------------------------------------------
function combine(repos, users, langs, lang_num) {
  //console.log('combine:');
  //console.log(repos.length + ' ' + users.length + ' ' + langs.length);
  let ans = [], index = [];
  for (let i = 0; i < 20; i++) index[i] = i;
  while (index.length > 0) {
    //console.log(index);
    let r = parseInt(Math.random() * index.length);
    //console.log(lang_num);
    //console.log(index[r]-lang_num-5);
    if (index[r] < lang_num) {
      let single = langs[index[r]];
      ans.push({m_name: single, m_type: 2});
    } else if (index[r] < lang_num + 5) {
      let single = users[index[r] - lang_num];
      ans.push({m_name: single, m_type: 0});
    } else {
      let single = repos[index[r] - lang_num - 5];
      ans.push({m_name: single, m_type: 1});
    }
    index.splice(r, 1);
  }
  return ans;
}

//---------------------------  time interval  --------------------------------------------------
function getInterval(time_bef) {
  let bef = new Date(time_bef);
  let aft = new Date();
  let days = aft.getTime() - bef.getTime();
  return parseInt(days / (1000 * 60 * 60 * 24));
}

//---------------------------  update recommend data  --------------------------------------------------
async function fetchData(userName, callback) {
  record_log('system', 'fetch recommend data for: ' + userName, 'add');
  let repos = await get_rec_repos(userName, 1, 1, 1, 1, 1);
  // console.log('-------------------------------------------------------------');
  // console.log(repos.length);
  // let repos = await get_rec_repos_by_also_star(userName,100);
  console.log('after fetch rec repo data!');
  // let users = await get_rec_users_by_language(userName,100);
  // console.log('don111');
  // users = await get_rec_repos_by_also_star(userName,100);
  // console.log('don222');
  // users = await get_rec_users_by_star_contributor(userName,100);
  // console.log('don333');
  users = await get_rec_users(userName, 1, 1, 1);
  console.log('don444');
  if (users == [] || users == null)
    users = await get_rec_users_when_zero(userName);
  console.log('after fetch rec user data!');
  let langs = await get_rec_languages(userName, 1, 1, 1);
  // let langs = await get_rec_languages_by_repos(userName,10);
  console.log('after fetch rec data!');
  console.log(repos.length + ' ' + users.length + ' ' + langs.length);
  let rec = [];
  for (let i = 0; i < users.length; i++) {
    rec.push({
      m_name: users[i],
      m_type: 0,
      m_date: 1
    });
  }
  for (let i = 0; i < langs.length; i++) {
    rec.push({
      m_name: langs[i],
      m_type: 2,
      m_date: 1
    });
  }
  for (let i = 0; i < repos.length; i++) {
    rec.push({
      m_name: repos[i],
      m_type: 1,
      m_date: 1
    });
  }
  let update = {
    $set: {
      recommend: rec
    }
  };
  //console.log(rec);
  userSchema.update({login: userName}, update, (err, res) => {
    //console.log('fetch again from algorithm');
    //console.log(res);
    callback(rec);
  })
}

//---------------------------  switch data, not fetch again(unless all recommended)  --------------------------------------------------
async function recNew(userName) {
  //console.log('rec new');
  record_log('system', 'rec new for: '+ userName, 'mark');
  let cur_user = await new Promise(function (resolve, reject) {
    userSchema.findOne({login: userName}, (err, user) => {
      if (err) reject(err);
      else if (user == null) reject('null');
      else resolve(user);
    })
  });
  let cur_rec = cur_user.recommend;
  let dislike = cur_user.dislike;

  let repo_rec = [], user_rec = [], lang_rec = [], repos = [], users = [], langs = [];
  for (let rec of cur_rec) {
    if (rec.m_date > 0) {
      if (rec.m_type == 0) user_rec.push(rec.m_name);
      else if (rec.m_type == 1) repo_rec.push(rec.m_name);
      else if (rec.m_type == 2) lang_rec.push(rec.m_name);
    }
  }
  let ran_num = parseInt(Math.random() * 3);
  // ran_num = 0;
  let lang_num = ran_num < lang_rec.length ? ran_num : lang_rec.length;
  if (repo_rec.length < 15 - lang_num || user_rec.length < 5 || lang_rec.length < lang_num) {
    cur_rec = await new Promise(function (resolve, reject) {
      fetchData(userName, (ret) => {
        resolve(ret);
      })
    });
    for (let rec of cur_rec) {
      if (rec.m_date > 0) {
        if (rec.m_type == 0) user_rec.push(rec.m_name);
        else if (rec.m_type == 1) repo_rec.push(rec.m_name);
        else if (rec.m_type == 2) lang_rec.push(rec.m_name);
      }
    }
  }
  let random_index = getRandomIndex(repo_rec.length, 15 - lang_num);
  for (let i = 0; i < random_index.length; i++) repos.push(repo_rec[random_index[i]]);
  random_index = getRandomIndex(user_rec.length, 5);
  for (let i = 0; i < random_index.length; i++) users.push(user_rec[random_index[i]]);
  random_index = getRandomIndex(lang_rec.length, lang_num);
  for (let i = 0; i < random_index.length; i++) langs.push(lang_rec[random_index[i]]);

  //console.log('to combine');
  let now = combine(repos, users, langs, lang_num);

  //delete unliked repos
  for (let i = 0; i < dislike.length; i++) {
    let index = now.findIndex(j => {
      return (j.m_type == dislike[i].m_type) && (j.m_name == dislike[i].m_name)
    });
    if (index >= 0) {
      now.splice(index, 1);
    }
  }
  //console.log('in rec new');
  //console.log(repos);
  //update
  for (let i = 0; i < cur_rec.length; i++) {
    if (cur_rec[i].m_date <= 0) {
      cur_rec[i].m_date -= 1;
    } else if (repos.findIndex(j => j == cur_rec[i].m_name) >= 0 || users.findIndex(j => j == cur_rec[i].m_name) >= 0 || langs.findIndex(j => j == cur_rec[i].m_name) >= 0) {
      cur_rec[i].m_date = 0;
    }
  }
  let update = {
    $set: {
      recommend: cur_rec,
      rec_date: (new Date()).toLocaleString().split(' ')[0],
      now_recommend: now
    }
  };
  let aw = await new Promise((resolve, reject) =>{
    userSchema.update({login: userName}, update, (err, res) => {
      //console.log('update recommend dates');
      //console.log(res);
      resolve(1);
    });
  });
  return now;
}

//---------------------------  update when login  --------------------------------------------------
async function getStart(userName) {
  record_log('system', 'get start to recommend in logic!', 'mark');
  let cur_rec = await new Promise(function (resolve, reject) {
    fetchData(userName, async (ret) => {
      let array = await recNew(userName);
      resolve(array);
    })
  });
  return cur_rec;
}

//---------------------------  main function  --------------------------------------------------
async function getNextDayRecommendData(userName) {
  let cur_user = await new Promise(function (resolve, reject) {
    userSchema.findOne({login: userName}, (err, user) => {
      if (err) reject(err);
      else if (user == null) reject('null');
      else resolve(user);
    })
  });
  if (cur_user.now_recommend.length == 0) return [];
  let ans = getDetail(cur_user.now_recommend);
  return ans;
  //}
}

function circle() {
  async.until(function () {
      return time_signal > 0;
    },
    function (cb) {
      let time = new Date();
      //if (time.getMinutes() % 10 == 0) console.log('ten minutes passed!............' + (new Date()).toLocaleString());
      if (time.getHours() == 21 && time.getMinutes() == 30 && time.getSeconds() == 0) time_signal = 1;
      setTimeout(cb, 1000);
    },
    function (err) {
      record_log('system', 'done one circle!', 'mark');
      time_signal = 0;
      userSchema.find({}, (err, users) => {
        for (let i = 0; i < users.length; i++) {
          recNew(users[i].login);
          updateInitialInfo(users[i].login);
        }
        circle();
      });
    });
}

export {getNextDayRecommendData, getARepo, getAUser, getDetail, getStart, circle}

//fakeUsers(20);
//fakeLangs(10);
//{recommend:[{name:'CR',type:0,date:0,like:1}]}
//userSchema.update({login:"chenmuen"}, {$set:{rec_date:"2016-09-07"}}, (err, res) => {
//  console.log(res);
//});
// userSchema.update({login:"RickChem"}, {$set:{recommend:[]}}, (err, res) => {
//  console.log(res);
//});
//userSchema.findOne({login:'chenmuen'}, (err, user) => {
//  let rec = user.recommend;
//  let count = 0;
//  for(let i=0;i<rec.length;i++){
//    if (rec[i].m_date<=0) count ++;
//  }
//  console.log(count);
//  console.log(rec.length);
//});
////getStart('RickChem');
//console.log(getRandomIndex(12, 10));
//getNextDayRecommendData('RickChem');

//fetchData('ChenDanni', (ret) => {
//  console.log(ret);
//})
//connect();
//async function test(){
//  let t = await recNew('RickChem');
//  console.log('done');
//}
//test();
