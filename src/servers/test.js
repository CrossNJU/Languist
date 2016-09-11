/**
 * Created by raychen on 16/9/6.
 */

//for (let i = 0; i < 100; i++) {
//  let t = parseInt(Math.random() * 3);
//  console.log(t);
//}

//let a = [{a:1},{a:2},{a:3},{a:4}];
//a.splice(0,1);
//console.log(a);

let a = [4,1,5,2];
a.sort((o1,o2) => {return o1<o2});
console.log(a);

//let a = ['a','b','cc'];
//for (let i=0;i< a.length;i++){
//  a[i] = 'ccc';
//}
//console.log(a);

//let t = new Date();
//let time = t.toLocaleString();
//let t2 = new Date('2016-09-04');
//console.log(t2.toLocaleString());

//  import {connect} from './config'
//import {updateUserStars,updateUserRepos, upsertRepo, updateRepoStar, upsertUser} from './logic/UpdateWhenLogin'
//var async = require("async");
//connect();

//upsertUser('ChenDanni', () => {
//  async.parallel([
//    (call) => {
//      updateUserStars('ChenDanni', true, (ret) => {
//        let met1 = [];
//        for (let i = 0; i < ret.length; i++) {
//          met1.push((call2) => {
//            upsertRepo(ret[i], () => {
//              updateRepoStar(ret[i], (ret2) => {
//                let met2 = [];
//                for (let j = 0; j < ret2.length; j++) {
//                  met2.push((call3) => {
//                    upsertUser(ret2[j], () => {
//                      updateUserStars(ret2[j], true, (ret3) => {
//                        let met3 = [];
//                        for (let k = 0; k < ret3.length; k++) {
//                          met3.push((call4) => {
//                            upsertRepo(ret3[k], () => {
//                              //setTimeout(() => {call4(null, 'done fail!')}, 1000);
//                              console.log('done from USER star repo: ' + ret[i] + ' to its starer: ' + ret2[j] + ' to its star repo: ' + ret3[k] + '!');
//                              call4(null, 'done 3!');
//                            });
//                          });
//                        }
//                        async.parallel(met3, (err, res) => {
//                          console.log(res);
//                          call3(null, 'done 2!');
//                        })
//                      });
//                    });
//                  });
//                }
//                async.parallel(met2, (err, res) => {
//                  console.log(res);
//                  call2(null, 'done 1!');
//                });
//              })
//            });
//          });
//
//        }
//        async.parallel(met1, (err, res) => {
//          console.log(res);
//          call(null, 'done 0!');
//        });
//      });
//    }
//  ], (err, res) => {
//    console.log(res);
//  });
//});

//async.parallel([
//  (call) => {
//    updateUserRepos('ChenDanni', true, (ret3) => {
//      let mets = [];
//      for (let k = 0; k < ret3.length; k++) {
//        mets.push((call2) => {
//          upsertRepo(ret3[k], () => {
//            console.log('done from :' + 'ChenDanni' + ' to its repo: ' + ret3[k] + '!');
//            call2(null, 'ok');
//          })
//        });
//      }
//      async.parallel(mets, (err, res) => {
//        console.log(res);
//        call(null, 1);
//      });
//    })
//  }
//  ],
//// optional callback
//  function(err, results) {
//    console.log(results);
//    // the results array will equal ['one','two'] even though
//    // the second function had a shorter timeout.
//  });
//setTimeout(() => {signa = 1;}, 1000);
//let signa = 0;
//async.until(function() {
//    return signa > 0;
//  },
//  function(cb) {
//    console.log('try');
//    setTimeout(cb, 200);
//  },
//  function(err) {
//    // 4s have passed
//    console.log('done!');
//    console.log(err); // -> undefined
//  });
