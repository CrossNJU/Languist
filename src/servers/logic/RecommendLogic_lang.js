/**
 * Created by raychen on 16/7/22.
 */

import {languageSchema} from '../../models/languageSchema'

function getRepoByUser(user, language_name, callback){
  languageSchema.findOne({"language":language_name}, 'ranked_repo', function (err, lang) {
    if (err) return console.error(err);
    callback(lang.ranked_repo);
  });
}

export {getRepoByUser}
