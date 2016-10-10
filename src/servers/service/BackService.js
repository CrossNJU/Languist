/**
 * Created by raychen on 16/9/18.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {my_userSchema} from '../../models/mysql-models/my_userSchema'
import {connect, logger} from '../config'
import {sended_low, sended_mid, sended_high} from '../data.js'

import {updateInitialInfo, updateWhenLogin, upsertUser} from '../logic/UpdateWhenLogin'
import {getFlowListData} from '../service/HomeService'
import {addAnewUser} from '../api/github_user'
import {setClient} from '../api/github_conf'
var async = require("async");

function getAllUserInfo(callback) {
  let ans = [];
  userSchema.find({}, (err, users) => {
    for (let i = 0; i < users.length; i++) {
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

function getUserInfo(login, callback) {
  userSchema.findOne({login: login}, (err, user)=> {
    callback(user);
  });
}

function findSendEmailUsers(type, callback) {
  let condition = {starred_count: {$gt: 20, $lt: 50}};
  let dup = sended_mid;
  let num = 20;
  if (type == 1) {
    condition = {starred_count: {$gt: 8, $lt: 20}};
    dup = sended_low;
    num = 100;
  } else if (type == 3) {
    condition = {starred_count: {$gt: 100}, followers_count: {$gt: 100}};
    dup = sended_high;
    num = 15;
  }
  dup = dup.split(';');
  my_userSchema.find(condition, (err, users)=> {
    let ans = [];
    let ans_out = '[';
    let c = 0;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email != 'Unknown' && users[i].email != null && c < num) {
        if (dup.findIndex(j => j == users[i].email) < 0) {
          c++;
          ans.push({
            login: users[i].login,
            email: users[i].email,
            following: users[i].followings_count,
            follower: users[i].followers_count,
            star: users[i].starred_count
          });
          ans_out = ans_out + users[i].email + ';';
        }
      }
    }
    ans_out = ans_out + ']';
    callback(ans_out);
  });
}

function addUsers(number, callback) {
  let condition = {starred_count: {$gt: 8, $lt: 20}};
  my_userSchema.find(condition, {}, {limit: number}, (err, users) => {
    var ans = [];
    for (let user of users) {
      ans.push(user.login);
    }
    callback(ans);
  });
}

async function insertRelated(users) {
  for (let user of users) {
    logger.debug(user);
    let met = [];
    // met.push((call) => {
    //   addAnewUser(user, "", () => {
    //     updateInitialInfo(user);
    //     call(null, 'done');
    //   });
    // });
    met.push((call) => {
      upsertUser(user, () => {
        updateWhenLogin(user);
        call(null, 'done');
      })
    });
    let end = await new Promise((resolve, reject) => {
      userSchema.findOne({login: user}, (err, resa) => {
        // if (resa == null) {
        //   async.parallel(met, async (err, res) => {
        //     logger.debug(res);
        //     getFlowListData(user, (ans) => {
        //       resolve(ans.length);
        //     });
        //     //resolve(1);
        //     // console.log('in');
        //   });
        // } else resolve('existed');
        if (resa.access_token != "") {
          setClient(resa.access_token);
          async.parallel(met, async(err, res) => {
            logger.debug(res);
            getFlowListData(user, (ans) => {
              resolve(ans.length);
            });
          });
        } else resolve('no access token');
      });
    });
    logger.debug(user + ": " + end);
  }
}

export {getAllUserInfo, getUserInfo, test}

//connect();
// findSendEmailUsers(1, (ans) => {
//   console.log(ans);
// });
// findSendEmailUsers(2, (ans) => {
//   console.log(ans);
// });
// findSendEmailUsers(3, (ans) => {
//   console.log(ans);
// });
// let test = sended_low;
// test = test.split(';');
// console.log(test);

// connect();
//var users = [ 'durrantm',
//  'benfyvie',
//  'atavistock',
//  'adamkittelson',
//  'brandonarbini',
//  'vvs',
//  'subwindow',
//  'r-stu31',
//  'sshao',
//  'jtdowney',
//  'jaywhy',
//  'heftig',
//  'retnuh',
//  'mainej',
//  'cyndis',
//  'mpalmer',
//  'Stormwind',
//  'pcapriotti',
//  'tonysidaway',
//  'mthorn',
//  'FunkyFortune',
//  'jdicioccio',
//  'piotrb',
//  'thomasdeniau',
//  'rnicholson',
//  'ehowe',
//  'krancour',
//  'lanej',
//  'michelleN',
//  'mage2k',
//  'iancoffey',
//  'Groogy',
//  'jchauncey',
//  'jgre',
//  'justinmcp',
//  'kubo',
//  'ngollan',
//  'caiquanqing',
//  'ndarilek',
//  'doudou',
//  'timabdulla',
//  'anthropomorphic',
//  'tokengeek',
//  'chrisseaton',
//  'pager',
//  'gcapizzi',
//  'jasonrclark',
//  'cyrilpic',
//  'jamesds',
//  'pietervisser' ];
var users = [
  'chenmuenzero',
  "Catherinena",
  "njushishuo",
  "Harry1001",
  "Tony-Wang",
  "zengchunhui",
  "KevinSmile",
  "sc89703312",
  "cuiods",
  "Sorumi",
  "DeepAQ",
  "owenchenz",
  "chenmuenzero",
  "oraisdy",
  "PolarisChen",
  "NJUShenbin",
  "sferik",
  "toastsgithub",
];

function test() {
  // connect();
  users = [];
  userSchema.find({}, (err, res) => {
    for (let user of res) {
      users.push(user.login);
    }
    insertRelated(users);
  });
}

// test();
