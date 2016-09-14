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
        resolve(null);
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
          size: lang_det.repo_num
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
      let ans = [];
      for (let lang of res) {
        ans.push({name:lang.language});
      }
      resolve(ans);
    })
  });
  return promise;
}

async function getLanguageSize(langName){
  let promise = await new Promise(function(resolve, reject){
    languageSchema.findOne({language: langName}, (err, lang) => {
      if (err) reject(err);
      resolve(lang.repo_num);
    });
  });
  return promise;
}

async function getAllLanguages(){
  let promise = await new Promise(function(resolve, reject){
    languageSchema.find({}, (err, res) => {
      if (err) reject(err);
      let ans = [];
      for (let lang of res) {
        ans.push(lang.language);
      }
      resolve(ans);
    }).sort({'repo_num': -1}).limit(15);
  });
  return promise;
}


export {getLanguageByUser, getLanguageSize, getLanguageByTag,getAllLanguages}

async function test(){
  connect();
  let t = await getLanguageByTag("Object-oriented");
  //let a = {"tt":{a:1, b:2}};
  console.log(t);
}

//test();
