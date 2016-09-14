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
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

const primaryColor = '#74C2CE';
const whiteColor = '#FFF';
const style = {
  dialogStyle: {
    width: '400px',
  },
  fieldStyle: {
    fontSize: '20px',
    marginTop: '-10px'
  },
  circularProgress: {
    position: 'relative',
    top: '-6px'
  }
};

class StarDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      setName: 'Ungrouped',
      isNewSet: false,
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.setList.push({name: 'New Set', count: 0});
  }

  async handleSubmit() {
    this.setState({isLoading: true});

    let repo = this.props.repo;
    let user = this.props.user;
    let newSet = '';

    console.log('Star ' + repo + ' ' + user);


    let url = '/api/repo/star';
    let res = await $.ajax(url, {data:{user: user, repo:repo}});


    console.log(res);

    if(res.res == 1 && this.state.isNewSet) {
      newSet = this.refs.field.input.value;
      console.log('star succeed');
      url = '/api/repo/AddSet';
      if(newSet){
        console.log('new is ' + newSet);
        res = await $.ajax(url, {data:{login: user, setname:newSet}});
      }else {
        res.res = 0;
      }
    }

    if(res.res == 1) {
      console.log('add succeed');
      url = 'api/repo/addToSet';
      res = await $.ajax(url, {data:{login: user, fullname:repo, setname: this.state.isNewSet?newSet:this.state.setName}});
    }

    if(res.res == 1) {
      console.log('add to succeed');
      this.handleClose(true, this.state.isNewSet?newSet:this.state.setName);
    }else {
      this.setState({error: 'Star Failed', isLoading: false});
    }

  }

  handleClose(isSuccess, set) {
    this.setState({error: '', setName: 'Ungrouped', isNewSet: false, isLoading: false});
    this.props.handleClose(isSuccess, set);
  }

  handleChange = (event, index, value) => {
    let newState = {};
    newState.setName = value;
    newState.isNewSet = value=='New Set';
    this.setState(newState);
  };

  renderMenuItem() {
    return this.props.setList.map((set)=>{
      return <MenuItem key={set.name+"Item"} value={set.name} primaryText={set.name}/>
    })
  }

  renderField() {
    if(this.state.isNewSet) {
      return <TextField hintText="New Set Name" ref="field"/>
    }
  }

  render() {
    return (
      <Dialog
        title="Add the repo to a set"
        modal={true}
        open={this.props.isOpen}
        contentStyle={style.dialogStyle}>
        <SelectField
          value={this.state.setName}
          onChange={this.handleChange.bind(this)}>
          {this.renderMenuItem()}
        </SelectField>
        {this.renderField()}
        <div className={s.btn__group}>
          <RaisedButton
            icon={!this.state.isLoading ? '' : <CircularProgress size={0.4} innerStyle={style.circularProgress} />}
            label={!this.state.isLoading ? 'DONE' : ''}
            primary={true}
            disabled={this.state.isLoading}
            disabledBackgroundColor={primaryColor}
            disabledLabelColor={whiteColor}
            onTouchTap={this.handleSubmit.bind(this)}/>
          <RaisedButton
            label="CANCEL"
            disabled={this.state.isLoading}
            onTouchTap={this.handleClose.bind(this, false, null)}/>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(StarDialog, s);
