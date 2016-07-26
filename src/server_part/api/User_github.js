/**
 * Created by raychen on 16/7/21.
 */

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
//
//getUserStarred('tricknotes', 1, [], (v) => {
//  console.log('done!' + v[0]);
//});
//getUserStarred('ChenDanni', 1, [], (v) => {
//  console.log('done!'+ v);
//});
export {getUserStarred}
