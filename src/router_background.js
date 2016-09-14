/**
 * Created by raychen on 16/9/14.
 */

import {reloadUser} from './servers/service/UserService'
import {getLog} from './servers/service/LogService'

function addTestApi(server){
  server.get('/api/test/session', (req, res)=>{
    //console.log('cookie time: ');
    res.send({res:req.session.cookie.expires});
  });
  server.get('/api/test/reload', (req, res) => {
    reloadUser(req.query.user, ()=> {
      res.send({res: SUCCESS});
    })
  });
  server.get('/api/test/null', (req, res) => {
    if(req.query.user !== undefined) res.send(req.query.user);
    else res.send('undefined');
  });
}

function addAdministerApi(server){
  server.get('/api/admin/log/get', (req, res) => {
    getLog(req.query.user, req.query.op, req.query.begin, req.query.end, (ans) => {
      res.send(ans);
    })
  });
}

export {addTestApi, addAdministerApi}
