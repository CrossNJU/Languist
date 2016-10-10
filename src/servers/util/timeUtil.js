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

// console.log(getTimeFromLong(1200293516000));

function translateTime(time) {
  time = time.replace(/-/g,'/');
  time = time.replace(/T/,' ');
  time = time.replace(/Z/,'');
  return time;
}

async function calTime(time1,time2){
  time1 = translateTime(time1);
  time2 = translateTime(time2);

  let start_date = new Date(time1);
  let end_date = new Date(time2);
  if (end_date - start_date < 0){
    console.log("time1 is larger than time2.ERROR TIME!");
    return -1;
  }else{
    let num = (end_date - start_date)/(1000*3600*24);
    let days = parseInt(Math.ceil(num)) - 1;
    return days;
  }
}

async function calLastUpdateTime(time){
  time = translateTime(time);
  let nowTime = new Date();
  let updateTime = new Date(time);
  let age = (nowTime - updateTime)/(1000*3600*24);
  age = parseInt(Math.ceil(age)) - 1;
  if (age < 0){
    console.log('Update time error!');
    return 10000;
  }
  return age;
}

// calTime('2015-04-15T13:28:22Z','2015-04-16T13:28:21Z');
// calLastUpdateTime('2015-04-16T13:28:21Z');


export {
  getTimeFromLong as transTime,
  calTime,
  calLastUpdateTime
}
