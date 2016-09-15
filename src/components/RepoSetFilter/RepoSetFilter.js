/**
 * Created by PolarisChen on 16/9/9.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoSetFilter.scss';

import RaisedButton from 'material-ui/RaisedButton';

import Filter from '../Filter';

class RepoSetFilter extends Component {
  constructor(props) {
    super(props);
  }
  renderAction() {
    if(this.props.isCurrentUser) {
      return (
        <div className={s.action}>
          <RaisedButton
            fullWidth={true}
            primary={true}
            label="Add New Repo Set"
            onTouchTap={this.props.handleClickAdd}
          />
        </div>
      )
    }else {
      return null;
    }
  }
  render() {
    return (
      <Filter current={this.props.current} data={this.props.data} handleClick={this.props.handleClickFilter}>{this.renderAction()}</Filter>
    );
  }
}

export default withStyles(RepoSetFilter, s);
