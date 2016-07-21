/**
 * Created by raychen on 16/7/21.
 */

var github = require('octonode');
var client = github.client();

function getUserStarred(login, page, array, callback) {
  let len = array.length;
  client.get('users/' + login + '/starred', {page: page}, function (err, status, body, headers) {
    if (body.length == 0) {
      callback(array);
    }else {
      for (let i = 0; i < body.length; i++) {
        let json = body[i];
        array[len] = json.full_name;
        len++;
      }
      getUserStarred(login, page+1, array, callback);
    }
  });
}
//
//getUserStarred('cebjyre', 1, [], (v) => {
//  console.log('done!'+v[0]);
//});
//getUserStarred('RobertDober', 1, [], (v) => {
//  console.log('done!'+v[0]);
//});
export {getUserStarred}
