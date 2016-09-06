/**
 * Created by raychen on 16/9/6.
 */

import {github_repoSchema} from '../../models/github_repoSchema'
import {getRepoLanguages} from '../api/github_repo'

function updateAllRepoLanguage(){
  const cursor = github_repoSchema.find().cursor();
  let i = 0;
  cursor.on('data', (doc) => {
    if (doc.languages.length == 0){
      getRepoLanguages(doc.full_name, (languages) => {
        let conditions = {full_name: doc.full_name};
        let update = {
          $set: {
            languages: languages
          }
        };
        github_repoSchema.update(conditions, update, (err, res) => {
          console.log(i++);
        });
      });
    }
  });
}

//updateAllRepoLanguage();
