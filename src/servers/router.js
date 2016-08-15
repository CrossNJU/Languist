/**
 * Created by raychen on 16/7/12.
 */

import express from 'express';

import {connect, disconnect} from './config'
import {home, test_login} from './test/testController';
import {saveUser} from './service/LoginService';
import {getFlowListData, getCountData, getLangListData} from './service/HomeService'

var server = express();

connect();

server.get('/', home);
server.get('/test', saveUser);
server.get('/test_login', test_login);

server.get('/repoList', (req, res) => {
  getFlowListData('cr', req.query.lang, call => {
    res.send(call);
  });
});
server.get('/count', (req, res) => {
  getCountData(req.query.user, call => {
    res.send(call);
  });
});
server.get('/langList', (req, res) => {
  getLangListData(req.query.user, call => {
    res.send(call);
  });
});


server.listen(3000, () => {
  console.log("starter is listening on 3000")
});
