/**
 * Created by raychen on 16/7/19.
 */

//let b = [{a:1}, {a:1}];
//console.log(b.length);
//b[2] = {a:2};
//console.log(b.length);

//let t=0;
//for (let i=0;i<10;i++){
//  console.log(i);
//  for (let j=0;j<100000000;j++) t++;
//}

let arr = ['a', 'b', 'c'];
let b = arr.findIndex(i => i=='c');
let c = arr.findIndex(i => i=='d');
console.log(b+' '+c);
