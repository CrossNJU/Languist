/**
 * Created by raychen on 16/7/21.
 */

import {userSchema} from '../../models/userSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {github_repoSchema} from '../../models/github_repoSchema'
import {addNewRepo} from './github_repo'
import {connect} from '../config'

var github = require('octonode');
var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});

var number_per_page = 100;

function newRepoWithoutFromAPI(full_name, callback){
  github_repoSchema.findOne({full_name:full_name}, (err, repo) => {
    if (repo == null) callback(true);
    else callback(false);
  });
}

function getUserInfo(login, callback){
  client.get('/users/' + login, {}, function (err, status, body, headers) {
    //console.log(body); //json object
    //console.log("callback: "+ fullname +"[.]");
    callback(body);
  });
}

function getUserStarred(login, page, array, is_insert, numbers, callback) {
  //console.log("in");
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('users/' + login + '/starred', {page: page, per_page: number_per_page>numbers?numbers:number_per_page, sort: 'updated', direction: 'desc'}, function (err, status, body, headers) {
      //console.log("in");
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = json.full_name;
          len++;
          if (is_insert) {
            newRepoWithoutFromAPI(json.full_name, (b) => {
              if (b) addNewRepo(json);
            });
          }
        }
        getUserStarred(login, page + 1, array, is_insert, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function getFollowings(login, page, array, numbers, callback) {
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('users/' + login + '/following', {page: page, per_page: number_per_page>numbers?numbers:number_per_page}, function (err, status, body, headers) {
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = json.login;
          len++;
        }
        getFollowings(login, page + 1, array, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function getPublicRepos(login, page, array, is_insert, numbers, callback) {
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('users/' + login + '/repos', {page: page, per_page: number_per_page>numbers?numbers:number_per_page, sort: 'updated', direction: 'desc'}, function (err, status, body, headers) {
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = json.full_name;
          len++;
          if (is_insert) {
            newRepoWithoutFromAPI(json.full_name, (b) => {
              if (b) addNewRepo(json);
            });
          }
        }
        getPublicRepos(login, page + 1, array, is_insert, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function getJoinRepos(login, page, array, is_insert, numbers, callback) {
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('users/' + login + '/subscriptions', {page: page, per_page: number_per_page>numbers?numbers:number_per_page, sort: 'updated', direction: 'desc'}, function (err, status, body, headers) {
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = json.full_name;
          len++;
          if (is_insert) {
            newRepoWithoutFromAPI(json.full_name, (b) => {
              if (b) addNewRepo(json);
            });
          }
        }
        getJoinRepos(login, page + 1, array, is_insert, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function starRepo(login, repo, callback){
  userSchema.findOne({login: login}, (err, user) => {
    var auth_client = github.client(user.access_token);
    var ghme = auth_client.me();
    ghme.star(repo, (err, data, header) => {
      if (err) callback(err);
      else {
        let update = {
          $inc: {
            star_num: 1
          },
          $addToSet: {
            star_repos: repo
          }
        };
        github_userSchema.update({login: login}, update, (err, res) => {
          callback(1);
        });
      }
    });
  });
}

function followUser(login, loginToFollow, callback){
  userSchema.findOne({login: login}, (err, user) => {
    var auth_client = github.client(user.access_token);
    var ghme = auth_client.me();
    ghme.follow(loginToFollow, (err, data, header) => {
      if (err) callback(err);
      else {
        let update = {
          $inc: {
            following: 1
          },
          $addToSet: {
            followings_login: loginToFollow
          }
        };
        github_userSchema.update({login: login}, update, (err, res) => {
          callback(1);
        });
      }
    });
  });
}

function addAnewUser(json, access_token){
  var conditions = {login : json.login };
  var update     = {$set : {
    login: json.login,
    level: 0,
    access_token: access_token,
    password: "123",
    language: [],
    recommend: [],
    rec_date: (new Date()).toLocaleString().split(' ')[0],
    repo_sets: []}
  };
  var options = {upsert : true};
  userSchema.update(conditions, update, options, function(error, res){
    console.log("new user!");
  });
}

function addAnewGitHubUser(json, callback=null){
  var conditions = {login : json.login };
  var update     = {$set : {
    login: json.login,
    avatar_url: json.avatar_url,
    type: json.type,
    name: json.name,
    company: json.company,
    location: json.location,
    email: json.email,
    public_repos: json.public_repos,
    public_gists: json.public_gists,
    followers: json.followers,
    following: json.following,
    created_at: json.created_at,
    updated_at: json.updated_at,
    star_num: -1,
    star_repos: [],
    followings_login: [],
    language: [],
    bio: json.bio,
    blog: json.blog,
    use_languages: [],
    repos: [],
    joinRepos: [],
    joinRepo_count: -1}
  };
  var options = {upsert : true};
  github_userSchema.update(conditions, update, options, function(error, res){
    //console.log("new github user:"+json.login);
    if (callback!=null) callback();
  });
}

//
//getUserStarred('RickChem', 1, [], (v) => {
//  console.log(v);
//});
//getUserStarred('ChenDanni', 1, [], (v) => {
//  console.log('done!'+ v);
//});
export {getUserInfo, getUserStarred, getPublicRepos, getFollowings, starRepo, followUser, addAnewUser, addAnewGitHubUser, getJoinRepos}


//getUserInfo("egower", (body) => {
//  connect();
//  addAnewGitHubUser(body);
//});

// client.limit(function (err, left, max) {
//  console.log(left); // 4999
//  console.log(max);  // 5000
// });

//getPublicRepos('RickChem', 1, [], false, 20, (ret) => {
//  console.log(ret);
//});
