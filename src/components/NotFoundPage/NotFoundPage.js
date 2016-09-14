/**
 * Created by PolarisChen on 16/9/15.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NotFoundPage.scss';

import RaisedButton from 'material-ui/RaisedButton';

import TitleBar from '../TitleBar';

const title = 'Page Not Found';

class NotFoundPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
    this.context.onPageNotFound();
  }

  handleTouchTap(event) {
    event.preventDefault();
    history.go(-1);
  }

  render() {
    return (
      <div>
        <TitleBar text="404 Page Not Found :-(" />
        <div className={s.container}>
          <p>The page you are looking for does not exist.</p>
          <RaisedButton label="Back to home" secondary={true} href="/home" />
        </div>
      </div>
    );
  }

}

export default withStyles(NotFoundPage, s);
