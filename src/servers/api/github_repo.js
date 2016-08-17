/**
 * Created by raychen on 16/7/26.
 */

import {github_repoSchema} from '../../models/github_repoSchema'

var github = require('octonode');
var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});

function getRepoInfo(fullname, callback) {
  client.get('/repos/'+fullname, {}, function (err, status, body, headers) {
    //console.log(body); //json object
    callback(body);
  });
}

function getRepoLanguages(fullname, callback){
  client.get('/repos/'+fullname+'/languages', {}, function (err, status, body, headers) {
    //console.log(body); //json object
    let res = [];
    for (let key in body){
      res.push(key);
    }
    callback(res);
  });
}

function addNewRepo(info){
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
      contributors: [],
      collaborators_count: -1,
      collaborators: [],
      pullrequests_count: -1,
      issues_count: info.open_issues_count,
      size: info.size,
      updated_at: info.updated_at,
      created_at: info.created_at,
      main_language: info.language,
      languages: []
    }
  };
  github_repoSchema.update({full_name: info.full_name}, update2, {upsert: true}, (err, res) => {
    console.log("new repo!");
    console.log(res);
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
export {getRepoInfo, getRepoLanguages, addNewRepo}
