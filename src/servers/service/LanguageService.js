/**
 * Created by raychen on 16/8/3.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'
import {connect} from '../config'

function chooseLanguage(login, language, level, callback){
  userSchema.findOne({login:login}, (err, user) => {
    let languages = user.language;
    let index = languages.findIndex(j => j.lang_name == language);
    if (index >= 0) {
      languages[index].lang_level = level;
    }else {
      languages.push({
        lang_name: language,
        lang_level: level
      });
    }
    let condition = {login: login};
    let update = {
      $set:{
        language: languages
      }
    };
    userSchema.update(condition, update, (err, res) => {
      //if (err) console.error(err);
      //console.log(login);
      //console.log(res);
      callback(1);
    })
  });
}

function getAllLanguage(callback){
  var q = languageSchema.find({}).sort({'repo_num': -1}).limit(15);
  q.exec((err, langs) => {
    let lang_names = [];
    for (let lang of langs){
      lang_names.push({
        name: lang.language,
        repos: lang.repo_num
      });
    }
    callback(lang_names);
  });
}

function deleteLanguage(login, language, callback){
  userSchema.findOne({login:login}, (err, res) =>{
    let languages = res.language;
    let index = languages.findIndex(j => j.lang_name == language);
    if (index >= 0) {
      languages.splice(index, 1);
    }
    let condition = {login: login};
    let update = {
      $set:{
        language: languages
      }
    };
    userSchema.update(condition, update, (err, res) => {
      //if (err) console.error(err);
      //console.log(login);
      //console.log(res);
      callback(1);
    })
  });
}

export {chooseLanguage as addLang, getAllLanguage, deleteLanguage}

//connect();
//chooseLanguage('RickChem', 'CSS', 3,  (res) => {console.log(res)});
