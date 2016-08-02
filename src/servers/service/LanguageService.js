/**
 * Created by raychen on 16/8/3.
 */

import {userSchema} from '../../models/userSchema'

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

export {chooseLanguage as addLang}

