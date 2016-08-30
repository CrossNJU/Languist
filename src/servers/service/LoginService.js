/**
 * Created by raychen on 16/7/15.
 */

import {userSchema} from '../../models/userSchema'
import {globalSchema} from '../../models/globalSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getUserInfo, getUserStarred, getPublicRepos, addAnewUser, getFollowings, addAnewGitHubUser} from '../api/github_user'
import {getRepoInfo, getRepoLanguages, getContributors, getStarredUsers, addNewRepo} from '../api/github_repo'
var superagent = require('superagent');

var getAccessURL = 'https://github.com/login/oauth/access_token';

var test_login = false;

function getCurrentUser(callback) {
  globalSchema.findOne({global_num: 1}, (err, glo) => {
    callback(glo.current_user);
  });
}

function login(username, password, callback) {
  userSchema.findOne({login: username}, (err, user) => {
    if (user == null) callback("no such user!");
    else {
      if (user.password == password) {
        //update current user
        let update = {
          $set: {
            current_user: username
          }
        };
        globalSchema.update({global_num: 1}, update, {upsert: true}, (err, res) => {
          console.log(res);
        });
        callback(1);
      }
      else if (user.password === undefined) callback("password not set yet!");
      else callback("password error!");
    }
  });
}

function register(username, password, callback) {
  var conditions = {login: username};
  var update = {
    $set: {
      password: password
    }
  };
  userSchema.update(conditions, update, (err, res) => {
    if (err) callback(err);
    else {
      callback(1);
    }
  });
}

function updateRepoCons(fullname, callback = null) {
  getContributors(fullname, 1, [], (ret2) => {
    var conditions2 = {full_name: fullname};
    var update2 = {
      $set: {
        contributors: ret2
      }
    };
    github_repoSchema.update(conditions2, update2, (err, res2) => {
      console.log("update repo: " + fullname + " cons!");
      console.log(res2);
      if (callback != null) callback(ret2);
    });
  })
}

function updateRepoStar(fullname, callback = null) {
  getStarredUsers(fullname, 1, [], true, (ret2) => {
    var conditions2 = {full_name: fullname};
    var update2 = {
      $set: {
        starers: ret2
      }
    };
    github_repoSchema.update(conditions2, update2, (err, res2) => {
      console.log("update repo: " + fullname + " starers!");
      console.log(res2);
      if (callback != null) callback(ret2);
    });
  });
}

function updateUserStars(login, callback = null) {
  getUserStarred(login, 1, [], (ret) => {
    var conditions = {login: login};
    var update = {
      $set: {
        star_num: ret.length,
        star_repos: ret
      }
    };
    github_userSchema.update(conditions, update, (err, res2) => {
      console.log("update user: " + login + " star repos!");
      console.log(res2);
      if (callback != null) callback(ret);
    });
  });
}

function updateUserRepos(login, callback = null) {
  getPublicRepos(login, 1, [], (ret) => {
    var conditions = {login: login};
    var update = {
      $set: {
        repos: ret
      }
    };
    github_userSchema.update(conditions, update, (err, res2) => {
      console.log("update user: " + login + " repos!");
      console.log(res2);
      if (callback != null) callback(ret);
    });
  });
}

async function upsertRepos(ret) {
  for (let i = 0; i < ret.length; i++) {
    let ans = await new Promise(function (resolve, reject) {
      github_repoSchema.findOne({full_name: ret[i]}, (err, check)=> {
        //add new repo
        if (check == null) {
          getRepoInfo(ret[i], info => {
            if (info) addNewRepo(info, () => {
              resolve(1);
            });
            else resolve(1);
          });
        } else {
          resolve(1);
        }
      });
    });
  }
}

async function upsertUser(ret) {
  for (let i = 0; i < ret.length; i++) {
    let ans = await new Promise(function (resolve, reject) {
      github_userSchema.findOne({login: ret[i]}, (err, check) => {
        if (check == null) {
          getUserInfo(ret[i], info => {
            if (info) addAnewGitHubUser(info, () => {
              resolve(1);
            });
            else resolve(1);
          });
        } else resolve(1);
      });
    });
  }
}

function updateWhenLogin(login) {
  //get star repos
  updateUserStars(login, async (ret) => {
    await upsertRepos(ret);
    for (let i = 0; i < ret.length; i++) {
      updateRepoCons(ret[i], async (ret2) => {
        await upsertUser(ret2);
        for (let j = 0; j < ret2.length; j++) updateUserRepos(ret2[j]);
      });
      updateRepoStar(ret[i], async (ret2) => {
        await upsertUser(ret2);
        for (let j = 0; j < ret2.length; j++) updateUserStars(ret2[j]);
      })
    }
  });
  //get repos
  updateUserRepos(login, async (ret) => {
    await upsertRepos(ret);
    for (let i = 0; i < ret.length; i++) {
      updateRepoCons(ret[i], async (ret2) => {
        await upsertUser(ret2);
        for (let j = 0; j < ret2.length; j++) {
          updateUserRepos(ret2[j]);
          updateUserStars(ret2[j]);
        }
      });
    }
  });
  //get followings
  getFollowings(login, 1, [], async (ret) => {
    var conditions = {login: login};
    var update = {
      $set: {
        followings_login: ret
      }
    };
    github_userSchema.update(conditions, update, (err, res2) => {
      console.log("update user: " + login + " followings!");
      console.log(res2);
    });
    await upsertUser(ret);
    for (let i = 0; i < ret.length; i++) {
      updateUserRepos(ret[i], async (repos) => {
        await upsertRepos(repos);
        for (let j = 0; j < repos.length; j++)
          updateRepoCons(repos[j]);
      });
      updateUserStars(ret[i], async (repos) => {
        await upsertRepos(repos);
        for (let j = 0; j < repos.length; j++)
          updateRepoCons(repos[j]);
      });
    }
  });
}

export var saveUser = (code, callback) => {
  superagent
    .post(getAccessURL)
    .send({client_id: 'd310933db63d64f563a0', client_secret: '82093b09a6840ed8fba314dd7089a7bb45e687fe', code: code})
    .set('Accept', 'application/json')
    .end(function (err, sres) {
      if (err) {
        console.log('err: ' + err);
        callback(0);
        return;
      }
      //console.log(sres.body);
      let access_token = sres.body.access_token;
      if (access_token === undefined) {
        console.log('undefined!');
        callback(0);
        return;
      }
      superagent
        .get('https://api.github.com/user')
        .query({access_token: access_token})
        .accept('json')
        .end((err, ssres) => {
          if (err) {
            return console.log(err);
          }
          callback(1);
          let json = JSON.parse(ssres.text);

          //insert new users
          addAnewUser(json, access_token);
          addAnewGitHubUser(json, () => {
            //update when login
            if (!test_login) updateWhenLogin(json.login);
          });
        });
    });
};

export {getCurrentUser, login, register}
