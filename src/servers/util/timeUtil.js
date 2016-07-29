/**
 * Created by raychen on 16/7/29.
 */

import moment from 'moment'

function getTimeFromLong(time){
  let date = moment(time).format('MMM Do YYYY');
  return date;
}

//console.log(getTimeFromLong(1447662857000));

export {
  getTimeFromLong as transTime
}
