/**
 * Created by raychen on 16/7/29.
 */

import {my_repoSchema} from '../mysql-models/my_repoSchema'
import {my_joinlanguageSchema} from '../mysql-models/my_joinlanguageSchema'
import {github_repoSchema} from '../github_repoSchema'
import {github_userSchema} from '../github_userSchema'
import {languageSchema} from '../languageSchema'

function createRepoFromMysql() {
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

function updateRepoAvatar() {
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

function updateRepoLanguage() {
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

function updateRepoRecover() {
  const cursor0 = github_repoSchema.find({contributors_count:-1}).cursor();
  cursor0.on('data', (doc0) => {
    const cursor = my_joinlanguageSchema.find({repo_full_name: doc0.full_name}).cursor();
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
    my_repoSchema.findOne({full_name: doc0.full_name}, (err, my_repo) => {
      if (my_repo != null){
        let update = {
          $set:{
            subscribers_count: my_repo.subscribers_count,
            contributors_count: my_repo.contributors_count,
            contributors: [],
            collaborators_count: my_repo.collaborators_count,
            collaborators: [],
            pullrequests_count: my_repo.pullrequests_count
          }
        };
        github_repoSchema.update({full_name: doc0.full_name}, update, (err, ress) =>{
          console.log(ress);
        })
      }
    })
  });
}

export {
  createRepoFromMysql as create_repo,
  updateRepoAvatar as repo_avatar,
  updateRepoLanguage as repo_language,
  updateRepoRecover as repo_recover,
}
