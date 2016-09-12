/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';

import s from './FeedbackDialog.scss';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  dialogStyle: {
    width: '500px',
  },
  fieldStyle: {
    fontSize: '20px',
    marginTop: '-10px'
  },
};

class FeedbackDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    }
  }

  async handleSubmit() {
    let value = this.refs.name.input.refs.input.value;
    console.log(this.props.user);

    if(value && value.length!=0) {

      let url = '/api/feedback/add';
      let result = await $.ajax(url, {data: {login: this.props.user, feedback: value}});
      if(result.res == 1) {
        this.handleClose();
      } else {
        this.setState({error: 'Feedback failed'});
      }
    } else {
      this.setState({error: 'Feedback failed'});
    }
  }

  handleClose() {
    this.setState({error: ''});
    this.props.handleClose();
  }

  render() {
    return (
      <Dialog
        title="Feedback"
        modal={true}
        open={this.props.isOpen}
        contentStyle={style.dialogStyle}>
        <TextField
          ref="name"
          hintText="We’d appreciate it if you could give us some feedbacks :-D"
          floatingLabelText="Your feedback"
          multiLine={true}
          fullWidth={true}
          rows={6}
          rowsMax={6}
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

export default withStyles(FeedbackDialog, s);
