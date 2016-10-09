/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';

import s from './InitLoadingDialog.scss';

import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

const style = {
  dialogStyle: {
    width: '600px',
  }
};

class InitLoadingDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingText: 'Loading',
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.isOpen) {
      this.getStatus();
    }
  }

  getStatus() {
    let timer;

    function fn() {
      $.ajax('/api/home/waitNumber', {
        success: (msg) => {
          // console.log(msg);
          let text = '';
          switch (msg.res) {
            case 0:
              text = 'Loading your data from GitHub';
              break;
            case 1:
              text = 'Recommending repositories';
              break;
            case 2:
              text = 'Recommending users';
              break;
            case 3:
              text = 'Recommending languages';
              break;
            case 4:
              clearInterval(timer);
              return ;
            case 5:
              text = 'Loading your starred repositories';
              break;
            case 6:
              text = 'Loading your own repositories';
              break;
            case 7:
              text = 'Loading repositories you contribute to';
              break;
            case 8:
              text = 'Loading your followed user';
              break;
          }

          this.setState({
            loadingText: text,
          })
      }})
    }

    try {
      timer = setInterval(fn.bind(this), 500);
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
        <Dialog
          modal={true}
          open={this.props.isOpen}
          contentStyle={style.dialogStyle}>
          <div className={s.content}>
            <p>We need to initialize some data for your first login Please be patient</p>
            <p>{this.state.loadingText}</p>
            <LinearProgress />
          </div>
        </Dialog>
    )
  }
}

export default withStyles(InitLoadingDialog, s);
