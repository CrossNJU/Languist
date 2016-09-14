/**
 * Created by PolarisChen on 16/9/15.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.scss';

import RaisedButton from 'material-ui/RaisedButton';

import TitleBar from '../TitleBar';

const title = 'Error';

class ErrorPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  handleTouchTap(event) {
    event.preventDefault();
    history.go(0);
  }

  render() {
    return (
      <div>
        <TitleBar text="500 Internal Server Error :-(" />
        <div className={s.container}>
          <p>Some error occurred on this page. Please try again later.</p>
          <RaisedButton label="Reload the page" secondary={true} onTouchTap={this.handleTouchTap.bind(this)} />
        </div>
      </div>
    );
  }

}

export default withStyles(ErrorPage, s);
