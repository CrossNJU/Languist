/**
 * Created by raychen on 16/7/14.
 */

import mongoose from 'mongoose'
import kitten from './kittySchema'

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

//test connection
db.on('error', () => {
  console.log('connect error!');
});
db.once('open', () => {
  console.log('connected!');
});

//util functions
function saveToDB(ins){
  ins.save((err, res) => {
    if (err) return console.error(err);
    console.log('save successfully: '+res.name);
  });
}

function log(res){
  console.log(res);
}

//tests
//var c1 = new kitten({ name: 'cat1', type: 'cat'});
//var c2 = new kitten({ name: 'cat2', type: 'cat'});
//var c3 = new kitten({ name: 'cat3', type: 'cat'});

//saveToDB(c1);
//saveToDB(c2);
//saveToDB(c3);

var c4 = new kitten({ name: 'cat4', type: 'cat'});
c4.findSimilarTypes((err, res) => {
  log(res);
});
