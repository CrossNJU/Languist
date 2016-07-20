/**
 * Created by raychen on 16/7/12.
 */

import express from 'express';
import {home, test2} from './testController';
import {getApi} from './LoginService';
var server = express();

server.get('/', home);
server.get('/test', getApi);
server.get('/test2', test2);

server.listen(3000, () => {
  console.log("starter is listening on 3000")
});
