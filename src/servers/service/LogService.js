/**
 * Created by raychen on 16/9/14.
 */

import {logSchema} from '../../models/logSchema'
import {connect} from '../config'

function record_log(user, content, op){
  let log = {
    user: user,
    content: content,
    time: (new Date()).toLocaleString(),
    operation: op
  };
  logSchema.create(log, (err, res) => {
    //console.log('add a log!');
    //console.log(res);
  });
}

function getLog(user, op, begin, after, callback){
  let condition = {};
  if (user !== undefined) condition.user = user;
  if (op !== undefined) condition.operation = op;
  if (begin === undefined && after === undefined){
    logSchema.find(condition, (err, logs) => {
      let ans = [];
      for (let log of logs){
        ans.push({
          user: log.user,
          time: log.time,
          operation: log.operation,
          content: log.content
        });
      }
      callback(ans);
    });
  } else {
    logSchema.find(condition, (err, logs)=>{
      let ans = [];
      let time_before = begin === undefined?0:new Date(begin);
      let time_after = after === undefined?new Date():new Date(after);
      for (let log of logs){
        let time = new Date(log.time);
        if (time.getTime() > time_before.getTime() && time.getTime()<time_after.getTime()){
          ans.push({
            user: log.user,
            time: log.time,
            operation: log.operation,
            content: log.content
          });
        }
      }
      callback(ans);
    })
  }
}

//connect();
//record_log('admin', 'test66', 'test2');
//getLog(null, 'test2', null, null, (ans) => {
//  console.log(ans);
//});
//console.log((new Date()).toUTCString());
export {record_log, getLog}
