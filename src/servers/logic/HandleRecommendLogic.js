/**
 * Created by raychen on 16/9/6.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema';
import {github_userSchema} from '../../models/github_userSchema'
import {languageSchema} from '../../models/languageSchema';
import {transTime} from '../util/timeUtil'
import {get_rec_languages, get_rec_languages_by_repos} from './RecommendLogic_languages'
import {get_rec_repos_by_following, get_rec_repos_by_user, get_rec_repos_by_also_star} from './RecommendLogic_repos'
import {get_rec_users, get_rec_users_by_star_contributor} from './RecommendLogic_users'
import {connect} from '../config'

async function fakeUsers(number){
  return await new Promise(function(resolve, reject) {
    github_userSchema.find({}).limit(number).exec( (err, res) => {
      let ret = [];
      for (let user of res) {
        ret.push(user.login);
      }
      //console.log(ret);
      resolve(ret);
    })
  })
}

async function fakeLangs(number){
  return await new Promise(function(resolve, reject) {
    languageSchema.find({}).limit(number).exec( (err, res) => {
      let ret = [];
      for (let lang of res) {
        ret.push(lang.language);
      }
      //console.log(ret);
      resolve(ret);
    })
  })
}

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
      console.log('repo:'+repo);
      let ret = {
        type: 'repo',
        avatarUrl: repo_single.owner_avatar_url,
        owner: repo_single.owner,
        name: repo_single.full_name.split("/")[1],
        description: repo_single.description,
        tags: repo_single.languages,
        update: transTime(repo_single.updated_at),
        star: repo_single.stars_count
      };
      resolve(ret);
    });
  });
}

function getAUser(user) {
  return new Promise(function (resolve, reject) {
    userSchema.findOne({login: user}, (err, user_single) => {
      console.log('user:'+user);
      if (err) reject(err);
      let lang_user = [];
      if (user_single != null){
        for (let lang_single of user_single.language) {
          lang_user.push(lang_single.lang_name);
        }
      }
      github_userSchema.findOne({login: user}, (err, github_user) => {
        //console.log(user);
        let ret = {
          type: 'user',
          avatarUrl: github_user.avatar_url,
          login: user,
          name: github_user.name,
          bio: github_user.bio,
          url: github_user.blog,
          langs: lang_user,
          join: github_user.created_at,
          location: github_user.location,
          follwers: github_user.followers
        };
        resolve(ret);
      });
    });
  });
}

async function combine(repos, users, langs, lang_num) {
  console.log('combine:');
  console.log(repos.length+' '+users.length+' '+langs.length);
  let ans = [], index = [];
  for (let i = 0; i < 20; i++) index[i] = i;
  while (index.length > 0) {
    //console.log(index);
    let r = parseInt(Math.random() * index.length);
    //console.log(lang_num);
    //console.log(index[r]-lang_num-5);
    if (index[r] < lang_num) {
      let single = await getALanguage(langs[index[r]]);
      ans.push(single);
    } else if (index[r] < lang_num + 5) {
      let single = await getAUser(users[index[r] - lang_num]);
      ans.push(single);
    } else {
      let single = await getARepo(repos[index[r] - lang_num - 5]);
      ans.push(single);
    }
    index.splice(r, 1);
  }
  return ans;
}

function getInterval(time_bef) {
  let bef = new Date(time_bef);
  let aft = new Date();
  let days = aft.getTime() - bef.getTime();
  return parseInt(days / (1000 * 60 * 60 * 24));
}

async function fetchData(userName, callback) {
  //console.log(userName);
  let repos = await get_rec_repos_by_also_star(userName, 100);
  //console.log('after fetch rec repo data!');
  let users = await get_rec_users_by_star_contributor(userName, 35);
  //console.log('after fetch rec user data!');
  let langs = await get_rec_languages_by_repos(userName, 15);
  console.log('after fetch rec data!');
  console.log(repos.length+' '+users.length+' '+langs.length);
  let rec = [];
  for (let i = 0; i < users.length; i++) {
    rec.push({
      m_name: users[i],
      m_type: 0,
      m_date: 1,
      m_like: 0
    });
  }
  for (let i = 0; i < langs.length; i++) {
    rec.push({
      m_name: langs[i],
      m_type: 2,
      m_date: 1,
      m_like: 0
    });
  }
  for (let i = 0; i < repos.length; i++) {
    rec.push({
      m_name: repos[i],
      m_type: 1,
      m_date: 1,
      m_like: 0
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

async function recNew(repos, users, langs, userName, cur_rec, interval){
    let repo_rec = [], user_rec = [], lang_rec = [];
    for (let rec of cur_rec) {
      if (rec.m_date > 0) {
        if (rec.m_type == 0) user_rec.push(rec.m_name);
        else if (rec.m_type == 1) repo_rec.push(rec.m_name);
        else if (rec.m_type == 2) lang_rec.push(rec.m_name);
      }
    }
    let ran_num = parseInt(Math.random() * 3);
    let lang_num = ran_num<lang_rec.length?ran_num:lang_rec.length;
    if (repo_rec.length < 15 - lang_num || user_rec.length < 5 || lang_rec.length < lang_num) {
      cur_rec = await new Promise(function(resolve, reject){
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

    //console.log('in rec new');
    //console.log(repos);
    //update
    for (let i = 0; i < cur_rec.length; i++) {
      if (cur_rec[i].m_date <= 0) {
        cur_rec[i].m_date -= interval;
      } else if (repos.findIndex(j => j == cur_rec[i].m_name) >= 0 || users.findIndex(j => j == cur_rec[i].m_name) >= 0 || langs.findIndex(j => j == cur_rec[i].m_name) >= 0) {
        cur_rec[i].m_date = 0;
      }
    }
    let update = {
      $set: {
        recommend: cur_rec,
        rec_date: (new Date()).toLocaleString().split(' ')[0]
      }
    };
    userSchema.update({login: userName}, update, (err, res) => {
      console.log('update recommend dates');
      //console.log(res);
    });
  return lang_num;
}

async function getStart(userName){
  console.log('get started!');
  let cur_rec = await new Promise(function(resolve, reject){
    fetchData(userName, (ret) => {
      resolve(ret);
    })
  });
  let lang_num = await recNew([], [], [], userName, cur_rec, 0);
  return 1;
}

async function getNextDayRecommendData(userName) {
  let cur_user = await new Promise(function (resolve, reject) {
    userSchema.findOne({login: userName}, (err, user) => {
      if (err) reject(err);
      else if (user == null) reject('null');
      else resolve(user);
    })
  });
  let interval = getInterval(cur_user.rec_date);
  let repos = [], users = [], langs = [];
  let cur_rec = cur_user.recommend;
  if (cur_rec.length == 0) {
    //console.log('in cur = 0');
    let ans = await new Promise(async function(resolve, reject){
      let done = await getStart(userName);
      if (done == 1) {
        let t = await getNextDayRecommendData(userName);
        resolve(t);
      }
    });
    console.log('after first!');
    return ans;
  } else {
    console.log('in combine');
    //console.log(cur_rec);
    let lang_num = 0;
    if (interval == 0) {
      //console.log('in');
      for (let rec of cur_rec) {
        if (rec.m_type == 0 && rec.m_date == 0) {
          users.push(rec.m_name);
        } else if (rec.m_type == 1 && rec.m_date == 0) {
          repos.push(rec.m_name);
        } else if (rec.m_type == 2 && rec.m_date == 0) {
          langs.push(rec.m_name);
          lang_num++;
        }
      }
    } else {
      lang_num = await recNew(repos, users, langs, userName, cur_rec, interval);
      console.log('after rec new');
      //console.log(repos);
    }
    //console.log(repos.length+users.length+langs.length);
    //console.log('done combine');
    return combine(repos, users, langs, lang_num);
  }
}

export {getNextDayRecommendData, getARepo}

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
