/**
 * Created by raychen on 16/7/29.
 */

import moment from 'moment'

function getTimeFromLong(time){
  let a = parseInt(time);
  if (a<1000000000000) a = time;
  let date = moment(a).format('MMM Do YYYY');
  return date;
}

//console.log(getTimeFromLong(1200293516000));

export {
  getTimeFromLong as transTime
}
