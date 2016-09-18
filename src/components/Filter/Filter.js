/**
 * Created by PolarisChen on 16/9/9.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Filter.scss';

import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

const listItemStyle = {
  paddingTop: '8px',
  paddingBottom: '8px'
};

const activeListItemStyle = {
  paddingTop: '8px',
  paddingBottom: '8px',
  backgroundColor: '#ccc'
};

class FilterItem extends Component {

  handleClick() {
    this.props.handleClick(this.props.item.name);
  }

  renderCount() {
    if(typeof(this.props.item.count) != "undefined") {
      return <div className={s.bubble}>{this.props.item.count}</div>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <ListItem
        innerDivStyle={this.props.current == this.props.item.name ? activeListItemStyle : listItemStyle}
        onClick={this.handleClick.bind(this)}>
        <div className={s.item}>
          <Avatar size={36} className={s.avatar}>{this.props.item.name.substr(0,1)}</Avatar>
          <div className={s.text}>{this.props.item.name}</div>
          {this.renderCount()}
        </div>
      </ListItem>
    );
  }
}

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  renderFilter() {
    let data = this.props.data;
    if (data.length > 0) {
      let filter = data.map(item => {
        return <FilterItem
          current={this.props.current}
          key={item.name}
          item={item}
          handleClick={this.props.handleClick}/>;
      });
      return filter;
    } else {
      return (
        <ListItem innerDivStyle={listItemStyle} disabled={true} >
          <div className={s.item}>
            <CircularProgress size={0.6} />
            <div className={s.text}>Loading filter...</div>
          </div>
        </ListItem>
      );
    }
  }
  render() {
    return (
      <Paper className={s.container}>
        <List>
          {this.renderFilter()}
        </List>
        {this.props.children}
      </Paper>
    );
  }
}

export default withStyles(Filter, s);
