/**
 * Created by raychen on 16/7/22.
 */

var github = require('octonode');
//var client = github.client();

var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});

client.limit(function (err, left, max) {
  console.log(left); // 4999
  console.log(max);  // 5000
});

