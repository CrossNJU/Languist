/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';

import s from './AddSetDialog.scss';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  dialogStyle: {
    width: '400px',
  },
  fieldStyle: {
    fontSize: '20px',
    marginTop: '-10px'
  },
};

class AddSetDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
  }

  handleSubmit() {
    let name = this.refs.name.input.value.replace(/(^s*)|(s*$)/g, "");

    if(name.length == 0) {
      this.setState({error:'The input is empty'});
    }else {
      let url = '/api/repo/addSet';
      $.ajax(url, {data: {setname: name, login: this.props.user}})
        .done((msg)=> {
          if(msg.res == 1){
            this.handleClose(true);
          }else {
            this.setState({error: 'Adding the set failed'});
          }
        });
    }
  }

  handleClose(isSuccess) {
    this.setState({error: ''});
    this.props.handleClose(isSuccess);
  }

  render() {
    return (
      <Dialog
        title="Add New Set"
        modal={true}
        open={this.props.isOpen}
        contentStyle={style.dialogStyle}>
        <TextField
          ref="name"
          hintText="Please input new set name"
          floatingLabelText="Set Name"
          errorText={this.state.error}
          style={style.fieldStyle}/>
        <div className={s.btn__group}>
          <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
          <RaisedButton label="CANCEL" onClick={this.handleClose.bind(this, false)}/>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(AddSetDialog, s);
