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
      setName: 'Ungrouped'
    }
  }

  async handleSubmit() {
    let repo = this.props.repo;
    let user = this.props.user;

    let url = '/api/repo/star';
    let res = await $.ajax(url, {data:{user: user, repo:repo}});
    console.log(res.res);

    if(res.res == 1) {
      url = 'api/repo/addToSet';
      res = await $.ajax(url, {data:{login: user, fullname:repo, setname: this.state.setName}});
      console.log(res.res);
      if(res.res == 1) {
        this.handleClose(true);
      }else {
        this.setState({error: 'Star Failed'});
      }
    }else {
      this.setState({error: 'Star Failed'});
    }

  }

  handleClose(isSuccess) {
    this.setState({error: ''});
    this.props.handleClose(isSuccess);
  }

  handleChange = (event, index, value) => this.setState({setName: value});

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
          value={this.state.setName}
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
