/**
 * Created by raychen on 16/9/7.
 */

var github = require('octonode');
var client = github.client({
  username: 'RickChem',
  password: 'cr112358132134'
});
var ghsearch = client.search();
var number_per_page = 100;

function searchRepo(query, sort, order, page, callback){
  ghsearch.repos({
    q: query,
    sort: sort,
    order: order,
    page:page,
    per_page:number_per_page
  }, (err, body, headers) => {
    callback(body.items);
  });
}

//searchRepo();
export {searchRepo}
