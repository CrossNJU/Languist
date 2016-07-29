/**
 * Created by raychen on 16/7/26.
 */

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

//getRepoInfo('mojombo/god', (res) => {
//  console.log(res);
//});
export {getRepoInfo}
