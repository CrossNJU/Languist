/**
 * Created by raychen on 16/7/28.
 */

import {connect, disconnect} from '../../servers/config'
import {my_languageSchema} from '../mysql-models/my_languageSchema'
import {my_repoSchema} from '../mysql-models/my_repoSchema'
import {my_userSchema} from '../mysql-models/my_userSchema'
import {my_userlanguageSchema} from '../mysql-models/my_userlanguageSchema'
import {my_joinlanguageSchema} from '../mysql-models/my_joinlanguageSchema'
import {github_repoSchema} from '../github_repoSchema'
import {github_userSchema} from '../github_userSchema'

let test_code = 6;
connect();

switch (test_code) {
  case 0:
  {
    //let query = my_languageSchema.find({});
    //query.exec((err, langs) => {
    //  console.log(langs.length);
    //})
    let condition = { "id": { $gt: 99999, $lt: 110000 } };
    let update = {
      $set: {
        is_done: true
      }
    };
    my_joinlanguageSchema.update(condition, update, {multi: true}, (err, res) => {
      console.log(res);
    })
  }
    break;
  case 1:
  {
    //repo
    const cusor = my_repoSchema.find({}).cursor();
    let i = 0;
    cusor.on('data', function (doc) {
      let repo = {
        full_name: doc.full_name,
        owner: doc.full_name.split("/")[0],
        owner_avatar_url: '',
        description: doc.description,
        url: 'https://github.com/' + doc.full_name,
        clone_url: doc.clone_url,
        subscribers_count: doc.subscribers_count,
        forks_count: doc.forks_count,
        stars_count: doc.stars_count,
        contributors_count: doc.contributors_count,
        contributors: [],
        collaborators_count: doc.collaborators_count,
        collaborators: [],
        pullrequests_count: doc.pullrequests_count,
        issues_count: doc.issues_count,
        size: doc.size,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
        main_language: doc.language,
        languages: []
      };
      github_repoSchema.create(repo, (err, res) => {
        console.log(i++);
      })
    })
  }
    break;
  case 2:
  {
    //user
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
    break;
  case 3:
  {
    //同步更新user-language
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
    //cursor.on('data', async (doc) => {
    //});
  }
    break;
  case 4:
  {
    //异步更新user-language
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
    break;
  case 5:
  {
    //异步更新repo-avatar
    const cursor = github_repoSchema.find({}).cursor();
    let i = 0;
    cursor.on('data', async (doc) => {
      let conditions = {login: doc.owner};
      github_userSchema.findOne(conditions, (err, user)=> {
        if (err) return console.log(err);
        if (user === undefined || user == null) {
        }
        else {
          let avatar = user.avatar_url;
          let update = {
            $set: {
              owner_avatar_url: avatar
            }
          };
          github_repoSchema.update({full_name: doc.full_name}, update, (err, res)=> {
            console.log(i++);
          });
        }
      });
    });
  }
    break;
  case 6:{
    //异步更新repo-language
    const cursor = my_joinlanguageSchema.find({is_done: undefined}).cursor();
    let i = 0;
    cursor.on('data', (doc) => {
      let conditions = {full_name: doc.repo_full_name};
      let update = {
        $addToSet: {
          languages: doc.language
        }
      };
      github_repoSchema.update(conditions, update, (err, res) => {
        console.log(doc.id);
      });
    });
  }
}
