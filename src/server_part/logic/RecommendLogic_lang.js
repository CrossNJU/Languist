/**
 * Created by raychen on 16/7/22.
 */

import language from '../../models/languageSchema'
import repoSchema from '../../models/github_repoSchema'

function getRepoByUser(user, language_name, callback){
  language.findOne({"language":language_name}, 'ranked_repo', async function (err, lang) {
    if (err) return console.error(err);
    let repos = lang.ranked_repo;
    let ans = [];
    if (repos.length > 0){
      for (let i=0;i<repos.length;i++){
        let full_name = repos[i];
        let repo_single = await new Promise((resolve, reject) => {
          repoSchema.findOne({"fullname": full_name}, 'description tags update_time star_num', (err, repo_sing) => {
            if (err){
              reject(err);
            }else {
              resolve(repo_sing);
            }
          });
        });
        ans[i] = {
          avatarUrl: '',
          owner: full_name.split("/")[0],
          name: full_name.split("/")[1],
          description: repo_single.description,
          tags: repo_single.tags,
          update: repo_single.update_time,
          star: repo_single.star_num
        };
      }
    }
    callback(ans);
  });
}

//getRepoByUser('cr', 'Java', (res) => {
//  console.log(res);
//});

export {getRepoByUser}
