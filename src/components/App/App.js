/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import Header from '../Header';
import Footer from '../Footer';

import Snackbar from 'material-ui/Snackbar';

import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Segoe UI, \'HelveticaNeue-Light\', sans-serif',
  palette: {
    primary1Color: '#74C2CE',
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: '#F2DF83',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  appBar: {
    color: '#F2DF83',
  },
  raisedButton: {
    fontWeight: '500'
  }
});

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      login: false,
      user: '',
      snackbarOpen: false,
      snackbarMessage: ''
    };
    console.log('constructor App');
  }

  checkLogin() {
    console.log('checkLogin App');
    $.ajax('/api/current_user')
    .done(((user) => {
      if (user !== '') {
        console.log(user);
        this.setState({login: true, user: user});
      }
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  componentWillMount() {
    console.log('componentWillMount App');
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentDidMount() {
    console.log('componentDidMount App');
    this.checkLogin();
  }

  componentWillUnmount() {
    this.removeCss();
  }

  handleLogout() {
    console.log('LOGOUT');
    $.ajax({url: '/api/logout', type: 'POST'})
    .done(((res) => {
      // console.log(res);
      window.location.href = '/login';
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message
    });
  };

  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    });
  };

  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
       handleSnackbarOpen: this.handleSnackbarOpen.bind(this)
    }));
    return !this.props.error ? (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className={s.container}>
        <Header handleSnackbarOpen={this.handleSnackbarOpen.bind(this)} login={this.state.login} handleLogout={this.handleLogout} user={this.state.user}/>
        {childrenWithProps}
        <Footer />
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose.bind(this)}
        />
      </div>
      </MuiThemeProvider>
    ) : (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className={s.container}>
        <Header handleSnackbarOpen={this.handleSnackbarOpen.bind(this)} login={this.state.login} handleLogout={this.handleLogout} user={this.state.user}/>
        {this.props.children}
      </div>
      </MuiThemeProvider>
    );
  }

}

export default App;
