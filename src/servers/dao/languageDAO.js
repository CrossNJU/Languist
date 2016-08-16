/**
 * Created by raychen on 16/8/16.
 */

import {languageSchema} from '../../models/languageSchema'
import {userSchema} from '../../models/userSchema'
import {connect} from '../config'

async function getLanguageByUser(login){
  let t =  await new Promise(function(resolve, reject){
    userSchema.findOne({login: login}, async (err, user) => {
      if (user == null) {
        reject(err);
      }
      let user_langs = user.language;
      let ans = [];
      for (let user_lang of user_langs){
        let lang_det = await new Promise(function(resolve2, reject){
          languageSchema.findOne({language: user_lang.lang_name}, (err, language) => {
            resolve2(language);
          });
        });
        ans.push({
          name: user_lang.lang_name,
          level: user_lang.lang_level,
          tag: lang_det.tags,
          size: (lang_det.repo_num+lang_det.user_num)/2
        });
      }
      resolve(ans);
    });
  });
  return t;
}

async function getLanguageByTag(tag){
  let promise = await new Promise(function(resolve, reject){
    languageSchema.find({tags: tag}, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });
  return promise;
}

async function getLanguageByName(langNames){
  let promise = await new Promise(function(resolve, reject){
    languageSchema.findOne()
  });
}

export {getLanguageByUser}

function test(){
  //connect();
  //let t = await getLanguageByTag("Functional");
  let a = {"tt":{a:1, b:2}};
  console.log(a.tt);
}

test();
