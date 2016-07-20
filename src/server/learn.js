/**
 * Created by raychen on 16/7/12.
 */

let a = 10;
//console.log(a);

console.log(Math.max(...[9,2,4]));


function* hello(){
  yield 'hello';
  yield 'world';
  return 'end';
}

var out = hello().next();
console.log(out);
