/**
 * Created by raychen on 16/8/3.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'

function chooseLanguage(login, language, level, callback){
  let condition = {login: login};
  let update = {
    $addToSet:{
      language: {
        lang_name: language,
        lang_level: level
      }
    }
  };
  userSchema.update(condition, update, (err, res) => {
    callback(1);
  })
}

function getAllLanguage(callback){
  var q = languageSchema.find({}).sort({'repo_num': -1}).limit(15);
  q.exec((err, langs) => {
    let lang_names = [];
    for (let lang of langs){
      lang_names.push(lang.language);
    }
    callback(lang_names);
  });
}

export {chooseLanguage as addLang, getAllLanguage}

