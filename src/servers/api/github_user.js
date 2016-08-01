/**
 * Created by raychen on 16/7/21.
 */

import {userSchema} from '../../models/userSchema'

var github = require('octonode');
var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});

function getUserStarred(login, page, array, callback) {
  let len = array.length;
  client.get('users/' + login + '/starred', {page: page, per_page: 100}, function (err, status, body, headers) {
    if (body === undefined || body.length == 0){
      callback(array);
    }else {
      for (let i = 0; i < body.length; i++) {
        let json = body[i];
        array[len] = json.full_name;
        len++;
      }
      getUserStarred(login, page + 1, array, callback);
    }
  });
}

function starRepo(login, repo, callback){
  userSchema.findOne({login: login}, (err, user) => {
    var auth_client = github.client(user.access_token);
    var ghme = auth_client.me();
    ghme.star(repo, (err, data, header) => {
      if (err) callback(err);
      else {
        let starred = user.star_num;
        let update = {
          $set: {
            star_num: starred + 1
          },
          $addToSet: {
            star_repos: repo
          }
        };
        userSchema.update({login: login}, update, (err, res) => {
          callback(1);
        });
      }
    });
  });
}

//
//getUserStarred('tricknotes', 1, [], (v) => {
//  console.log('done!' + v[0]);
//});
getUserStarred('ChenDanni', 1, [], (v) => {
  console.log('done!'+ v);
});
export {getUserStarred, starRepo}
