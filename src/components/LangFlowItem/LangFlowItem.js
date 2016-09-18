/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangFlowItem.scss';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Add from 'material-ui/svg-icons/content/add';

class LangFlowItem extends Component {
  handleAdd() {
    this.props.handleAdd(this.props.lang.name,0,false);
  }

  render() {
    return (
      <Paper className={s.item}>
        <div className={s.text}>
          <div className={s.title}>{this.props.lang.name}</div>
          <div className={s.subtitle}>{this.props.lang.description}</div>
        </div>
        <div className={s.action}>
          <RaisedButton
            icon={<Add />}
            label={'Add'}
            primary={true}
            onClick={this.handleAdd.bind(this)} />
        </div>
      </Paper>
    );
  }
}

export default withStyles(LangFlowItem, s);
