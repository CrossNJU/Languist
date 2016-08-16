/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangQuestion.scss';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';

class LangQuestion extends Component {
  handleChoose(event, value) {
    if(this.props.question.type == 'radio'){
      this.props.onChoose(value);
    }
  }

  renderOptions(type) {
    if(!this.props.question.options) {
      return null;
    }

    var Button = this.props.question.type == "radio" ? RadioButton : Checkbox;
    return this.props.question.options.map(option => {
      return (
        <Button
          key={"option"+option.value}
          value={option.value}
          label={option.option}
          labelStyle={{width: 'auto'}}
          style={{width:'auto'}}/>
      );
    })
  }

  render() {
    var ButtonGroup = this.props.question.type == "radio" ? RadioButtonGroup : 'div';

    return (
      <div className={s.question__wrapper}>
        <h1 className={s.question__title}>{this.props.question.question}</h1>
        <ButtonGroup className={s.options__wrapper} name={this.props.question.question} defaultSelected={"0"} ref="group" onChange={this.handleChoose.bind(this)}>
          {this.renderOptions(this.props.question.type)}
        </ButtonGroup>
      </div>
    );

  }
}


export default withStyles(LangQuestion, s);
