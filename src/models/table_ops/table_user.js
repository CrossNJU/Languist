/**
 * Created by raychen on 16/7/29.
 */

import {my_userSchema} from '../mysql-models/my_userSchema'
import {github_userSchema} from '../github_userSchema'
import {my_userlanguageSchema} from '../mysql-models/my_userlanguageSchema'

function createFromMysql() {
  const cusor = my_userSchema.find({}).cursor();
  let i = 0;
  cusor.on('data', function (doc) {
    let user = {
      login: doc.login,
      name: doc.name,
      type: doc.type,
      avatar_url: doc.avatar_url,
      html_url: doc.html_url,
      followers_count: doc.followers_count,
      followings_count: doc.followings_count,
      repo_star_count: doc.repo_star_count,
      starred_count: doc.starred_count,
      subscription_count: doc.subscription_count,
      public_gists: doc.public_gists,
      public_repo: doc.public_repo,
      email: doc.email,
      location: doc.location,
      blog: doc.blog,
      company: doc.company,
      create_at: doc.create_at,
      repos: [],
      languages: []
    };
    github_userSchema.create(user, (err, res) => {
      console.log(i++);
    })
  });
}

function updateUserLanguage_syn() {
  const cursor = my_userlanguageSchema.find({}).cursor();
  let i = 0;
  cursor.eachAsync(doc => {
    return new Promise((resolve, reject) => {
      let conditions = {login: doc.user_login};
      github_userSchema.findOne(conditions, (err, user)=> {
        if (err) reject(err);
        if (user === undefined || user == null) resolve();
        else {
          let langs = user.languages;
          if (langs.indexOf(doc.language) == -1) {
            langs.push(doc.language);
            let update = {
              $set: {
                languages: langs
              }
            };
            github_userSchema.update(conditions, update, (err, res)=> {
              console.log(i++);
              resolve(res);
            });
          } else {
            resolve();
          }
        }
      });
    });
  }).then(() => console.log('done!'));
}

function updateUserLanguage_asy() {
  const cursor = my_userlanguageSchema.find({}).cursor();
  let i = 0;
  cursor.on('data', async (doc) => {
    let conditions = {login: doc.user_login};
    github_userSchema.findOne(conditions, (err, user)=> {
      if (err) return console.log(err);
      if (user === undefined || user == null) {
      }
      else {
        let langs = user.languages;
        if (langs.indexOf(doc.language) == -1) {
          langs.push(doc.language);
          let update = {
            $set: {
              languages: langs
            }
          };
          github_userSchema.update(conditions, update, (err, res)=> {
            console.log(i++);
          });
        }
      }
    });
  });
}

export {
  createFromMysql as create_user,
  updateUserLanguage_asy as user_language,
  updateUserLanguage_syn as user_language_syn
}
