/**
 * Created by raychen on 16/7/29.
 */

import {my_languageSchema} from '../mysql-models/my_languageSchema'
import {my_languagetagSchema} from '../mysql-models/my_languagetag'
import {github_repoSchema} from '../github_repoSchema'
import {languageSchema} from '../languageSchema'

function createFromMysql() {
  const cusor = my_languageSchema.find({}).cursor();
  let i = 0;
  cusor.on('data', function (doc) {
    let language = {
      language: doc.language,
      repo_num: doc.repo_num,
      user_num: doc.user_num
    };
    languageSchema.create(language, (err, res) => {
      console.log(i++);
    })
  })
}

function updateLanguageRankedRepo(){
  const cursor = languageSchema.find({}).cursor();
  cursor.on('data', doc => {
    var q = github_repoSchema.find({main_language: doc.language}).sort({'stars_count': -1}).limit(10);
    q.exec(function(err, repos) {
      let condition = {language: doc.language};
      let fulls = [];
      for (let i=0;i<repos.length;i++){
        if (i==0) console.log(repos[i].full_name);
        fulls.push(repos[i].full_name);
      }
      let update = {
        $set: {
          ranked_repo: fulls
        }
      };
      languageSchema.update(condition, update, (err, res) =>{
        console.log(doc.language);
      });
    });
  });
}

function updateLanguageTags(){
  const cursor = languageSchema.find({}).cursor();
  cursor.on('data', doc => {
    var q = my_languagetagSchema.find({language: doc.language});
    q.exec((err, tags) => {
      let tag_names = [];
      for (let tag of tags) {
        tag_names.push(tag.tag_name);
      }
      let update = {
        $set: {
          tags: tag_names
        }
      };
      let condition = {language: doc.language};
      languageSchema.update(condition, update, (err, res) =>{
        console.log(doc.language);
      });
    })
  });
}

export {
  createFromMysql as create_language,
  updateLanguageRankedRepo as language_rankedRepo,
  updateLanguageTags as language_tags
}
