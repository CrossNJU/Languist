/**
 * Created by raychen on 16/9/6.
 */

import {userSchema} from '../../models/userSchema'
import {github_repoSchema} from '../../models/github_repoSchema';
import {github_userSchema} from '../../models/github_userSchema'
import {languageSchema} from '../../models/languageSchema';
import {transTime} from '../util/timeUtil'
import {get_rec_languages} from './RecommendLogic_languages'
import {get_rec_repos_by_following, get_rec_repos_by_user, get_rec_repos_by_also_star} from './RecommendLogic_repos'
import {get_rec_users} from './RecommendLogic_users'

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
      console.log(repo);
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
      if (err) reject(err);
      let lang_user = [];
      for (let lang_single of user_single.language) {
        lang_user.push(lang_single.lang_name);
      }
      github_userSchema.findOne({login: user}, (err, github_user) => {
        let ret = {
          type: 'user',
          avatarUrl: github_user.avatar_url,
          login: user_single.login,
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
  let ans = [], index = [];
  for (let i = 0; i < 20; i++) index[i] = i;
  while (index.length > 0) {
    let r = parseInt(Math.random() * index.length);
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
  console.log('inin');
  let repos = await get_rec_repos_by_also_star(userName, 100);
  console.log('after');
  console.log(repos);
  let users = await get_rec_users(userName, 35);
  console.log(users);
  let langs = await get_rec_languages(userName, 15);
  console.log(langs);
  let rec = [];
  for (let i = 0; i < repos.length; i++) {
    rec.push({
      name: repos[i],
      type: 1,
      date: 1,
      like: 0
    });
  }
  for (let i = 0; i < users.length; i++) {
    rec.push({
      name: users[i],
      type: 0,
      date: 1,
      like: 0
    });
  }
  for (let i = 0; i < langs.length; i++) {
    rec.push({
      name: langs[i],
      type: 2,
      date: 1,
      like: 0
    });
  }
  let update = {
    $set: {
      recommend: rec
    }
  };
  userSchema.update({login: userName}, update, (err, res) => {
    console.log('fetch again from algorithm');
    console.log(res);
    callback();
  })
}

function getRandomIndex(array_len, len) {
  if (len < array_len) return [];
  let index = [], ret = [];
  for (let i = 0; i < array_len; i++) index[i] = i;
  while (ret.length < len) {
    let r = parseInt(Math.random() * index.length);
    ret.push(index[r]);
    index.splice(r, 1);
  }
  return ret;
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
  if (interval == 0) {
    if (cur_rec.length == 0){
      console.log('in');
      await fetchData(userName, () => {
        return getNextDayRecommendData(userName)
      });
    }else {
      for (let rec of cur_rec) {
        if (rec.type == 0 && rec.date == 0) {
          users.push(rec.name);
        } else if (rec.type == 1 && rec.date == 0) {
          repos.push(rec.name);
        } else if (rec.type == 2 && rec.date == 0) {
          langs.push(rec.name);
        }
      }
    }
  } else {
    let repo_rec = [], user_rec = [], lang_rec = [];
    for (let rec of cur_rec) {
      if (rec.date > 0) {
        if (rec.type == 0) user_rec.push(rec.name);
        else if (rec.type == 1) repo_rec.push(rec.name);
        else if (rec.type == 2) lang_rec.push(rec.name);
      }
    }
    let lang_num = parseInt(Math.random() * 3);
    if (repo_rec.length < 15 - lang_num || user_rec.length < 5 || lang_rec.length < lang_num) {
      fetchData(userName, () => {
        return getNextDayRecommendData(userName)
      });
    } else {
      let random_index = getRandomIndex(repo_rec.length, 15 - lang_num);
      for (let i = 0; i < random_index.length; i++) repos.push(repo_rec[random_index[i]]);
      random_index = getRandomIndex(user_rec.length, 5);
      for (let i = 0; i < random_index.length; i++) users.push(user_rec[random_index[i]]);
      random_index = getRandomIndex(lang_rec.length, lang_num);
      for (let i = 0; i < random_index.length; i++) langs.push(lang_rec[random_index[i]]);

      //update
      for (let i = 0; i < cur_rec.length; i++) {
        if (cur_rec[i].date <= 0) {
          cur_rec[i].date -= interval;
        } else if (repos.findIndex(i => i == cur_rec[i].name) >= 0 || users.findIndex(i => i == cur_rec[i].name) >= 0 || langs.findIndex(i => i == cur_rec[i].name) >= 0) {
          cur_rec[i].date = 0;
        }
      }
      let update = {
        $set: {
          recommend: cur_rec
        }
      };
      userSchema.update({login: userName}, update, (err, res) => {
        console.log('update recommend dates');
        console.log(res);
      })
    }
  }

  return combine(repos, users, langs);
}

export {getNextDayRecommendData}
