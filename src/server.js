/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import schema from './data/schema';
import Router from './routes';
import assets from './assets';
import { port, auth, analytics } from './config';

//config and test
import {connect, disconnect, SUCCESS, FAIL} from './servers/config'
import {home, test_login} from './servers/test/testController';
//services
import {saveUser, login, register} from './servers/service/LoginService';
import {getFlowListData, getCountData, getLangListData, getCoverData} from './servers/service/HomeService'
import {addLang, getAllLanguage} from './servers/service/LanguageService'
import {evaluateRecommend, getUserFollowings, getUserFollowers, getUserFollowingsAndFollowersNum} from './servers/service/UserService'
import {addAReopSet, addARepoToSet, getRepoSet, getRepoSetList, getRelatedRecommend, getRepoInfos, addMore} from './servers/service/RepoService'
//others
import {starRepo, followUser} from './servers/api/github_user'
import {searchRepo} from './servers/api/github_search'

var session = require('express-session');
connect();

const server = global.server = express();
const ret_success = 'success';

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 60000}
}));

//
// Authentication
// -----------------------------------------------------------------------------
server.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
  getToken: req => req.cookies.id_token,
  /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
}));
server.use(passport.initialize());

server.get('/login/facebook',
  passport.authenticate('facebook', {scope: ['email', 'user_location'], session: false})
);
server.get('/login/facebook/return',
  passport.authenticate('facebook', {failureRedirect: '/login', session: false}),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, {expiresIn});
    res.cookie('id_token', token, {maxAge: 1000 * expiresIn, httpOnly: true});
    res.redirect('/');
  }
);

//
// Register API middleware
// ------------------------------------------------------------------------------
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: {request: req},
  pretty: process.env.NODE_ENV !== 'production',
})));

// ---------------------------------------------------------------------------------------------------------------my part

//test
//server.get('/api/test', (req, res) => {
//  res.send({res:1});
//});

//login success
server.get('/api/login/success', (req, res)=> {
  saveUser(req.query.code, (ress) => {
    if (ress != null) {
      req.session.tempname = ress;
      res.redirect('/register');
    }
    else res.redirect('/login');
  });
});
//login
server.get('/api/login', (req, res) => {
  login(req.query.username, req.query.password, (res2) => {
    if (res2 == SUCCESS) {
      req.session.username = req.query.username;
      res.send({res: SUCCESS});
    } else
      res.send({res: res2});
  })
});
//register
server.get('/api/register', (req, res) => {
  register(req.query.username, req.query.password, (res2) => {
    if (res2 == SUCCESS) {
      res.send({res: SUCCESS});
    } else
      res.send({res: res2});
  })
});
//logout
server.get('/api/logout', (req, res) => {
  req.session.username = null;
  req.session.tempname = null;
  res.redirect('/login');
});
//test login
//server.get('/api/test_login', test_login);

//star repo
server.get('/api/repo/star', (req, res)=> {
  starRepo(req.query.user, req.query.repo, resa => {
    if (resa == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: FAIL});
  });
});
//follow user
server.get('/api/user/follow', (req, res)=> {
  followUser(req.query.user, req.query.follow, resa => {
    if (resa == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: FAIL});
  });
});

//get recommend data
server.get('/api/home/flowList', (req, res) => {
  getFlowListData(req.query.user, ret => {
    res.send(ret);
  });
});
//home-count
server.get('/api/home/count', (req, res) => {
  getCountData(req.query.user, call => {
    res.send(call);
  });
});
//home-language list
server.get('/api/home/langList', (req, res) => {
  getLangListData(req.query.user, call => {
    res.send(call);
  });
});
//home-cover
server.get('/api/home/cover', (req, res)=> {
  getCoverData(req.query.user, call => {
    res.send(call);
  });
});

//evaluate the recommend
server.get('/api/rec/evaluate', (req, res) => {
  evaluateRecommend(req.query.login, req.query.name, req.query.type, (resa) => {
    if (resa == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: FAIL});
  })
});

//get current user
server.get('/api/current_user', (req, res) => {
  res.send(req.session.username);
});

//get temp user
server.get('/api/temp_user', (req, res) => {
  res.send(req.session.tempname);
});

//choose language
server.get('/api/lang/choose', (req, res) => {
  addLang(req.query.login, req.query.lang, req.query.level, ret => {
    if (ret == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: FAIL});
  });
});

//get all language
server.get('/api/language/all', (req, res) => {
  getAllLanguage((langs) => {
    res.send(langs);
  })
});

//add a repo to a repo set
server.get('/api/repo/addToSet', (req, res) => {
  addARepoToSet(req.query.login, req.query.fullname, req.query.setname, (resa) => {
    if (resa == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: resa});
  })
});

//add a repo set
server.get('/api/repo/addSet', (req, res) => {
  addAReopSet(req.query.login, req.query.setname, (resa) => {
    if (resa == SUCCESS) res.send({res: SUCCESS});
    else res.send({res: resa});
  });
});

//search repo
server.get('/api/search/repo', (req, res) => {
  searchRepo(req.query.q, req.query.sort, req.query.order, req.query.page, (resa) => {
    res.send(resa);
  })
});

//get set list
server.get('/api/repo/setList', (req, res) => {
  getRepoSetList(req.query.user, (resa) => {
    res.send(resa);
  })
});

//get set
server.get('/api/repo/set', (req, res) => {
  getRepoSet(req.query.user, req.query.setName, (resa) => {
    res.send(resa);
  })
});

//get followings
server.get('/api/user/following', (req, res) => {
  getUserFollowings(req.query.user, (resa) => {
    res.send(resa);
  })
});

//get followers
server.get('/api/user/follower', (req, res) => {
  getUserFollowers(req.query.user, (resa) => {
    res.send(resa);
  })
});

//get followersNum and followingsNum (eg.{followings:1, followers:1})
server.get('/api/user/folInfo', (req, res) => {
  getUserFollowingsAndFollowersNum(req.query.user, (resa) => {
    res.send(resa);
  })
});

//get recommend repo
server.get('/api/repo/related', (req, res) => {
  getRelatedRecommend(req.query.fullName, (resa) => {
    res.send(resa);
  })
});

//get repo infos
server.get('/api/repo/info', (req, res) => {
  getRepoInfos(req.query.fullName, (resa) => {
    res.send(resa);
  })
});

//add more
//需要传入第几次add more
server.get('/api/recommend/more', (req, res) => {
  addMore(req.query.login, req.query.times, (resa) => {
    res.send(resa);
  })
});

//
// Register server-side rendering middleware
// ---------------------------------------------------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const template = require('./views/index.jade');
    const data = {title: '', description: '', css: '', body: '', entry: assets.main.js};

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => (data.title = value),
      onSetMeta: (key, value) => (data[key] = value),
      onPageNotFound: () => (statusCode = 404),
    };

    await Router.dispatch({path: req.path, query: req.query, context}, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    res.status(statusCode);
    res.send(template(data));
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
