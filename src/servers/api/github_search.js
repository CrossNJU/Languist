/**
 * Created by raychen on 16/9/7.
 */

import {getClient} from './github_conf'
import {transTime} from '../util/timeUtil'
var number_per_page = 50;

function searchRepo(query, language, page, callback){
  var client = getClient();
  var ghsearch = client.search();
  let keyword = query;
  if (language != 'All') keyword = keyword+'+language:'+language;
  ghsearch.repos({
    q: keyword,
    page:page,
    per_page:number_per_page
  }, (err, body, headers) => {
    let ans_repo = [];
    let languages = [];
    if (body !== undefined){
      let repos = body.items;
      for (let i=0;i<repos.length;i++){
        let repo = repos[i];
        ans_repo.push({
          type: 'repo',
          avatarUrl: repo.owner.avatar_url,
          owner: repo.owner.login,
          name: repo.name,
          description: repo.description,
          tags: [],
          update: transTime(repo.updated_at),
          star: repo.stargazers_count,
          full_name: repo.full_name
        });
        if (repo.language != null){
          let index = languages.findIndex(j => j.name == repo.language);
          if (index >= 0){
            //languages[index].count ++;
          }else {
            languages.push({
              name: repo.language
              //count: 1
            })
          }
        }
      }
    }
    callback({
      count: body.total_count,
      repoList: ans_repo,
      language: languages
    });
  });
}

function searchUserJoinRepo(login, callback){
  var client = getClient();
  var ghsearch = client.search();
  let keyword = "user:"+login;
  ghsearch.repos({
    q: keyword,
    sort: 'stars',
    order: 'desc',
    page:1,
    per_page:10
  }, (err, body, headers) => {
    let repos = body.items;
    let ans_repo = [];
    let languages = [];
    for (let i=0;i<repos.length;i++){
      let repo = repos[i];
      ans_repo.push({
        type: 'repo',
        avatarUrl: repo.owner.avatar_url,
        owner: repo.owner.login,
        name: repo.name,
        description: repo.description,
        tags: [],
        update: transTime(repo.updated_at),
        star: repo.stargazers_count,
        full_name: repo.full_name
      });
      if (repo.language != null){
        let index = languages.findIndex(j => j.name == repo.language);
        if (index >= 0){
          //languages[index].count ++;
        }else {
          languages.push({
            name: repo.language
            //count: 1
          })
        }
      }
    }
    callback({
      count: body.total_count,
      repoList: ans_repo,
      language: languages
    });
  });
}

//searchRepo();
export {searchRepo}

//searchRepo('tetris', 'All', 1, (ans) => {
//  console.log(ans);
//});
