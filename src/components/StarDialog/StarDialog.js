/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';

import s from './StarDialog.scss';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const style = {
  dialogStyle: {
    width: '400px',
  },
  fieldStyle: {
    fontSize: '20px',
    marginTop: '-10px'
  },
};

class StarDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      value: 'Ungrouped'
    }
  }

  handleSubmit() {
    this.handleClose(true);
  }

  handleClose(isSuccess) {
    this.setState({error: ''});
    this.props.handleClose(isSuccess);
  }

  handleChange = (event, index, value) => this.setState({value});

  renderMenuItem() {
    return this.props.setList.map((set)=>{
      return <MenuItem key={set.name+"Item"} value={set.name} primaryText={set.name}/>
    })
  }

  render() {
    return (
      <Dialog
        title="Add New Set"
        modal={true}
        open={this.props.isOpen}
        contentStyle={style.dialogStyle}>
        <SelectField
          value={this.state.value}
          onChange={this.handleChange.bind(this)}>
          {this.renderMenuItem()}
        </SelectField>
        <div className={s.btn__group}>
          <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
          <RaisedButton label="CANCEL" onClick={this.handleClose.bind(this, false)}/>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(StarDialog, s);
