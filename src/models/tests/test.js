/**
 * Created by raychen on 16/7/28.
 */

import {connect, disconnect} from '../../servers/config'
import {create_user,user_language,user_language_syn} from '../table_ops/table_user'
import {create_repo,repo_avatar,repo_language} from '../table_ops/table_repo'
import {create_language,language_rankedRepo, language_tags} from '../table_ops/table_language'

let test_code = 9;
connect();

switch (test_code) {
  case 0:
  {
    let condition = {"id": {$gt: 99999, $lt: 110000}};
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
    create_repo();
    break;
  case 2:
    create_user();
    break;
  case 3:
    user_language_syn();
    break;
  case 4:
    user_language();
    break;
  case 5:
    repo_avatar();
    break;
  case 6:
    repo_language();
    break;
  case 7:
    create_language();
    break;
  case 8:
    language_rankedRepo();
    break;
  case 9:
    language_tags();
    break;
}
