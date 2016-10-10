/**
 * Created by ChenDanni on 2016/8/15.
 */

import {getLanguageByUser} from '../dao/languageDAO'
import {getLanguageByTag} from '../dao/languageDAO'
import {getLanguageSize,getAllLanguages} from '../dao/languageDAO'
import {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo} from '../dao/UserDAO'
import {getStarRepoByUser, getPublicRepoByUser, getRepoInfo,getJoinRepoByUser} from '../dao/RepoDAO'
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

async function get_rec_languages_by_select(login, rec_num){
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
      score: lang_count[key] + await getLanguageSize(key)/300000
    };
    lang_info.push(temp_lang);
  }

  lang_info.sort(getSortFun('desc', 'score'));

  //console.log(lang_info);
  //取前rec_num返回作为推荐语言
  for (let i = 0;i < rec_num;i++){
    if (i >= lang_info.length) break;
    rec_langs.push(lang_info[i].name);
  }

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
    if (temp_lan == null)
      continue;

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
  // console.log(rec_lan);
  return rec_lan;

}

//user->repos->languages    此时user若没有选仓库中用到的语言,推荐仓库中他用到过的语言给他
//也可用于user还没有选语言的时候
async function get_rec_languages_by_repos(login,rec_num) {
  let repos = await getJoinRepoByUser(login);
  let selected_lan = await getLanguageByUser(login);
  let user_lans = [];
  let init_lans = [];
  let lan_arrays = [];
  let rec_lan = [];

  for (let i = 0;i < selected_lan.length;i++){
    user_lans.push(selected_lan[i].name);
  }

  for (let i = 0;i < repos.length;i++){
    let temp_repo = await getRepoInfo(repos[i]);
    // let temp_lans = temp_repo.languages;
    let temp_lan = temp_repo.main_language;

    if ((!(user_lans.indexOf(temp_lan) > -1))&&(temp_lan != null)){
      if (init_lans.hasOwnProperty(temp_lan)){
        init_lans[temp_lan] ++;
      }else {
        init_lans[temp_lan] = 1;
      }
    }

  }

  for (let language in init_lans){
    let temp = {
      name: language,
      count: init_lans[language]
    };
    lan_arrays.push(temp);
  }
  lan_arrays.sort(getSortFun('desc','count'));

  for (let i = 0;i < rec_num;i++){
    if (i >= lan_arrays.length){
      break;
    }
    rec_lan.push(lan_arrays[i].name);
  }
  return rec_lan;
}

//如果用户为000
async function get_rec_language_when_zero(rec_num){
  let languages = await getAllLanguages();
  let rec_lan = [];

  for (let i = 0;i < rec_num;i++){
    if (2*i >= languages.length)
      break;
    rec_lan.push(languages[2*i]);
  }
  // console.log(rec_lan);
  return rec_lan;
}

async function get_rec_languages(login,select_percent,following_percent,repo_percent){
  let base = 5;
  let select_num = base * select_percent;
  let following_num = base * following_percent;
  let repo_num = base * repo_percent;

  let all_languages = await getAllLanguages();

  let select_rec = await get_rec_languages_by_select(login,select_num);
  // console.log(select_rec);
  let following_rec = await get_rec_languages_by_following(login,following_num);
  // console.log(following_rec);
  let repo_rec = await get_rec_languages_by_repos(login,repo_num);
  // console.log(repo_rec);
  let base_lan = await get_rec_language_when_zero(base);

  let init_languages = [];
  let rec_languages = [];

  init_languages.push(select_rec);
  init_languages.push(following_rec);
  init_languages.push(repo_rec);

  // console.log(init_languages);

  for (let i = 0;i < init_languages.length;i++){
    for (let j = 0;j < init_languages[i].length;j++){
      if (all_languages.indexOf(init_languages[i][j]) > -1){
        if (rec_languages.indexOf(init_languages[i][j]) <= -1)
          rec_languages.push(init_languages[i][j]);
      }
    }
  }

  if (rec_languages.length == 0)
    return base_lan;

  // console.log(rec_languages);
  return rec_languages;
}

export {get_rec_languages,get_rec_languages_by_select,get_rec_languages_by_following,
        get_rec_languages_by_repos,get_rec_language_when_zero}


// get_rec_languages_by_select('RickChem');
// get_rec_languages_by_following('ChenDanni',5);
// get_rec_languages_by_repos('ChenDanni',5);
// get_rec_languages('ChenDanni',1,1,1);

// get_rec_language_when_zero(5);

async function test(){
  connect();
  let user_tags = await get_user_tag('ChenDanni');
  console.log('tags');
  console.log(user_tags);
}
// test();


