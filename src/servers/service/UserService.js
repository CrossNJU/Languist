/**
 * Created by raychen on 16/8/15.
 */

import {userSchema} from '../../models/userSchema'
import {languageSchema} from '../../models/languageSchema'

function evaluateRecommend(login, name, type, like) {
  userSchema.findOne({login: login}, (err, user) => {
    let rec = user.recommend;
    let index = rec.findIndex(j => {
      return (j.m_type == type) && (j.m_name == name)
    });
    rec[index].m_like = like;
    userSchema.update({login: login}, {$set: {recommend: rec}}, (err, res) => {
      console.log('update recommend feedback!');
      console.log(res);
    })
  });
}

export {evaluateRecommend}
