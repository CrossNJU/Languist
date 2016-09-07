/**
 * Created by ChenDanni on 2016/8/15.
 */

import {getLanguageByUser} from '../dao/languageDAO'
import {getLanguageByTag} from '../dao/languageDAO'
import {getLanguageSize} from '../dao/languageDAO'
import {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo} from '../dao/UserDAO'
import {connect} from '../config'

let rec_langs = [];
let user_langs = [];
let user_tags = [];
let tag_num = 3;
let lang_count = {};

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}


//得到user的tag情况
//user_tags{
// tag : num,tag:num
// }
async function get_user_tag(login){
  let user_langs = await getLanguageByUser(login);
  //console.log(user_langs[0]["tag"]);
  let user_tags = {};
  let tags_sort = [];
  //遍历list，统计tag各自的数量
  for (let i = 0;i < user_langs.length;i++){
    for (let j = 0;j < user_langs[i]["tag"].length;j++){
      let key = user_langs[i]["tag"][j];
      if (user_tags.hasOwnProperty(key)){
        user_tags[key] += 1;
      }else {
        user_tags[key] = 1;
      }
    }
  }
  //tag排序->用户哪方面的语言用的比较多
  for (var key in user_tags){
    let temp_tag = {
      name: key,
      count: user_tags[key]
    };
    tags_sort.push(temp_tag);
  }

  tags_sort.sort(getSortFun('desc', 'count'));

  //console.log(tags_sort);

  return tags_sort;
}

async function get_rec_languages(login,rec_num){
  let lang_info = [];

  user_langs = await getLanguageByUser(login);

  user_tags = await get_user_tag(login);

  //取tag排名中的前tag_num的语言,统计语言出现的次数
  let count = 0;
  for (let i = 0;i < user_tags.length;i++){
    //console.log(user_tags[i]);
    let tag = user_tags[i];
    let temp_langs = await getLanguageByTag(tag['name']);
    let tag_count = tag['count'];
    for (let j = 0;j < temp_langs.length;j++){
      let key = temp_langs[j]['name']; //language name
      if (lang_count[key] != undefined){
        lang_count[key] += tag_count;
      }else {
        lang_count[key] = tag_count;
      }
    }
    count++;
    if (count >= tag_num){
      count = 0;
      break;
    }
  }

  //去除重复（用户已经有的语言）
  for (let i = 0;i < user_langs.length;i++){
    let lang = user_langs[i].name;
    if (lang_count.hasOwnProperty(lang)){
      delete lang_count[lang];
    }
  }

  //将所得语言按流行度和用户语言tag统计结果排序
  for (let key in lang_count){
    let temp_lang = {
      name: key,
      score: lang_count[key] + await getLanguageSize(key)/60000000
    };
    lang_info.push(temp_lang);
  }
  lang_info.sort(getSortFun('desc', 'score'));

  //console.log(lang_info);
  //取前rec_num返回作为推荐语言
  let re = 0;
  let wlen = lang_info.length;
  for (let i = 0;i < wlen;i++){
    if (wlen < re){break;}

    rec_langs.push(lang_info[i].name);
    re++;
    if (re == rec_num){
      re = 0;
      break;
    }

  }

  //console.log(rec_langs);

  return rec_langs;
}

//user->following->languages
async function get_rec_languages_by_following(login,rec_num){
  let followings = await getFollowingByUser(login);
  let user_lan = await getLanguageByUser(login);
  let init_lan = [];
  let lan_array = [];
  let rec_lan = [];
  let same = false;

  //following->languages
  for (let i = 0;i < followings.length;i++) {
    let temp_lan = await getLanguageByUser(followings[i]);

    for (let j = 0; j < temp_lan.length; j++) {
      for (let k = 0;k < user_lan.length;k++){
        if (user_lan[k].name == temp_lan[j].name){
          j++;
          same = true;
          break;
        }
      }
      if (same == true){
        same = false;
        continue;
      }
      if (init_lan.hasOwnProperty(temp_lan[j].name)) {
        init_lan[temp_lan[j].name]++;
      } else {
        init_lan[temp_lan[j].name] = 1;
      }
    }
  }

  //sort
  for (let language in init_lan){
    let temp_lan = {
      name: language,
      count: init_lan[language]
    };
    lan_array.push(temp_lan);
  }

  lan_array.sort(getSortFun('desc','count'));

  for (let i = 0;i < rec_num;i++){
    if (i >= lan_array.length){
      break;
    }
    rec_lan.push(lan_array[i].name);
  }
  console.log(rec_lan);
  return rec_lan;

}

async 

export {get_rec_languages,get_rec_languages_by_following}

connect();
//get_rec_languages('RickChem');
get_rec_languages_by_following('ChenDanni',5);
