/**
 * Created by raychen on 16/7/22.
 */

let sample = {
  avatarUrl: '',
  owner: 'facebook',
  name: 'react',
  description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces. https://facebook.github.io/react/',
  tags: [
    'JavaScript',
    'Framework'
  ],
  update: 'July 11, 2016',
  star: 2731
}

import language_schema from '../models/languageSchema'

function getRepoByUser(user, language, callback){
  language_schema.findOne({"language":language}, 'ranked_repo', function (err, lang) {
    if (err) return console.error(err);
    callback(lang.ranked_repo);
  });
}

export {getRepoByUser}
