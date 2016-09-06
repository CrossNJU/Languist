/**
 * Created by raychen on 16/7/26.
 */

import {github_repoSchema} from '../../models/github_repoSchema'

var github = require('octonode');
var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});

var number_per_page = 100;

function getRepoInfo(fullname, callback) {
  client.get('/repos/' + fullname, {}, function (err, status, body, headers) {
    //console.log(body); //json object
    //console.log("callback: "+ fullname +"[.]");
    callback(body);
  });
}

function getRepoLanguages(fullname, callback) {
  client.get('/repos/' + fullname + '/languages', {}, function (err, status, body, headers) {
    //console.log(body); //json object
    let res = [];
    for (let key in body) {
      res.push(key);
    }
    callback(res);
  });
}

function getStarredUsers(fullname, page, array, numbers, callback) {
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('repos/' + fullname + '/stargazers', {page: page, per_page: number_per_page>numbers?numbers:number_per_page}, function (err, status, body, headers) {
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = json.login;
          len++;
        }
        getStarredUsers(fullname, page + 1, array, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function getContributors(fullname, page, array, numbers, callback) {
  let len = array.length;
  if (numbers == 0) callback(array);
  else {
    client.get('repos/' + fullname + '/contributors', {page: page, per_page: number_per_page>numbers?numbers:number_per_page}, function (err, status, body, headers) {
      if (body === undefined || body.length == 0){
        callback(array);
      }else {
        for (let i = 0; i < body.length; i++) {
          let json = body[i];
          array[len] = {
            login: json.login,
            contributions: json.contributions
          };
          len++;
        }
        getContributors(fullname, page + 1, array, numbers>number_per_page?numbers-number_per_page:0, callback);
      }
    });
  }
}

function addNewRepo(info, callback=null) {
  let update2 = {
    $set: {
      full_name: info.full_name,
      owner: info.owner.login,
      owner_avatar_url: info.owner.avatar_url,
      description: info.description,
      url: info.html_url,
      clone_url: info.clone_url,
      subscribers_count: -1,
      forks_count: info.forks_count,
      stars_count: info.stargazers_count,
      contributors_count: -1,
      collaborators_count: -1,
      collaborators: [],
      pullrequests_count: -1,
      issues_count: info.open_issues_count,
      size: info.size,
      updated_at: info.updated_at,
      created_at: info.created_at,
      main_language: info.language,
      languages: [],
      contributors: [],
      starers: []
    }
  };
  github_repoSchema.update({full_name: info.full_name}, update2, {upsert: true}, (err, res) => {
    //console.log("new repo:"+info.full_name);
    //console.log(res);
    if (callback != null) callback();
  });
}

//getRepoInfo("CrossNJU/PASS", info => {
//  let update2 = {
//    $set: {
//      full_name: info.full_name,
//      owner: info.owner.login,
//      owner_avatar_url: info.owner.avatar_url,
//      description: info.description,
//      url: info.html_url,
//      clone_url: info.clone_url,
//      subscribers_count: -1,
//      forks_count: info.forks_count,
//      stars_count: info.stargazers_count,
//      contributors_count: -1,
//      contributors: [],
//      collaborators_count: -1,
//      collaborators: [],
//      pullrequests_count: -1,
//      issues_count: info.open_issues_count,
//      size: info.size,
//      updated_at: 0,//info.updated_at,
//      created_at: 0,//info.created_at,
//      main_language: info.language,
//      languages: []
//    }
//  };
//  github_repoSchema.update({full_name: info.full_name}, update2, {upsert: true}, (err, res) => {
//    console.log(res);
//  });
//});
export {getRepoInfo, getRepoLanguages, getStarredUsers, getContributors, addNewRepo}
