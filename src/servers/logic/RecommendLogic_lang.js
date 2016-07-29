/**
 * Created by raychen on 16/7/22.
 */

import language from '../../models/tests/_languageSchema'
import repoSchema from '../../models/mysql-models/my_repoSchema'

function getRepoByUser(user, language_name, callback){
  language.findOne({"language":language_name}, 'ranked_repo', function (err, lang) {
    if (err) return console.error(err);
    callback(lang.ranked_repo);
  });
}

//getRepoByUser('cr', 'Java', (res) => {
//  console.log(res);
//});

export {getRepoByUser}
