/**
 * Created by PolarisChen on 16/9/11.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

import Paper from 'material-ui/Paper';
import FeedbackDialog from '../FeedbackDialog';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false
    }
  }

  handleFeedbackDialogOpen() {
    this.setState({isDialogOpen: true});
  }

  handleFeedbackDialogClose() {
    this.setState({isDialogOpen: false});
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link className={s.brand} to="/home">
            <img src={require('./logo-brand-text@2x.png')} height="32" alt="Languist" />
          </Link>
          <Navigation handleSnackbarOpen={this.props.handleSnackbarOpen} className={s.nav} login={this.props.login} handleLogout={this.props.handleLogout} handleFeedback={this.handleFeedbackDialogOpen.bind(this)}/>
        </div>
        <FeedbackDialog isOpen={this.state.isDialogOpen} user={this.props.user} handleClose={this.handleFeedbackDialogClose.bind(this)}/>
      </div>
    );
  }

}

export default withStyles(Header, s);
