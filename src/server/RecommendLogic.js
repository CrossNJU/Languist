/**
 * Created by raychen on 16/7/20.
 */

let users = [
  {
    login: 1,
    starred: ['a', 'b', 'd']
  },
  {
    login: 2,
    starred: ['b', 'e', 'c']
  },
  {
    login: 3,
    starred: ['d', 'c']
  },
  {
    login: 4,
    starred: ['d', 'b', 'c']
  },
  {
    login: 5,
    starred: ['a', 'd']
  }
];

let items = [];
let N = [];
let w = [];
let K = 3;

//物品到序号的映射,构造items和user的starred_array和N
function _toArray(str, arr){
  for (let i=0;i<str.length;i++){
    let index = items.findIndex(j => j==str[i]);
    if (index == -1){
      let len = items.length;
      items[len] = str[i];
      index = len;
      N[len] = 0;
    }
    arr[i] = index;
    N[index]++;
  }
}

//计算仓库相似度w
function cal_similarity(actions){
  for (let i=0;i<actions.length;i++){
    actions[i].starred_array = [];
    _toArray(actions[i].starred, actions[i].starred_array);
  }
  for (let i=0;i<items.length;i++){
    w[i]=[];
    for (let j=0;j<items.length;j++){
      w[i][j] = 0;
    }
  }
  for (let i= 0; i<actions.length; i++){
    let starred = actions[i].starred_array;
    for (let j=0; j<starred.length; j++){
      for (let k=j+1; k<starred.length; k++){
        w[starred[j]][starred[k]] ++;
        w[starred[k]][starred[j]] ++;
      }
    }
  }
  for (let i=0;i<items.length;i++){
    for (let j=0;j<items.length;j++){
      w[i][j] = w[i][j]/Math.sqrt(N[i]*N[j]);
    }
    //console.log(items[i]+': '+N[i]);
    //console.log(w[i]);
  }
}

//取与p仓库相似度最高的K个仓库
function _getFirstK(p){
  let com = [];
  for (let i=0;i<items.length;i++) com[i]=i;
  com.sort((o1, o2) => {
    return w[o2][p] - w[o1][p];
  });
  return com.slice(0,K);
}

//计算各个仓库推荐排名
function rank(action, r, num){
  let score = [];
  let indexs = [];
  for (let i=0;i<items.length;i++){
    indexs[i] = i;
    let S = _getFirstK(i);
    score[i] = 0;
    for (let j=0;j<S.length;j++){
      let index = action.starred_array.findIndex(k => k==S[j]);
      if (index != -1){
        score[i] += r[index]*w[S[j]][i];
      }
    }
  }
  indexs.sort((o1, o2) => {return score[o2]-score[o1]});
  let ret=[];
  for (let i=0;i<num;i++) ret[i]=items[indexs[i]];
  return ret;
}

//cal_similarity(users);
//rank(users[3], [1,1,1]);

export {rank, cal_similarity}
