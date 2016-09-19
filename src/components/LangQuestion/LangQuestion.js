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

    var Button = type == "radio" ? RadioButton : Checkbox;

    var options;

    if(type == 'radio') {
      options = this.props.question.options;
    }else {
      options = this.props.question.languageOption[this.props.language].map((option)=> {
        return this.props.question.options[option];
      });
    }

    return options.map(option => {
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

  renderGroup(type) {
    switch (type) {
      case 'radio':
        return (
          <RadioButtonGroup className={s.options__wrapper} name={this.props.question.question} defaultSelected={this.props.defaultLevel} ref="group" onChange={this.handleChoose.bind(this)}>
            {this.renderOptions(type)}
          </RadioButtonGroup>
        );
      case 'checkbox':
        return (
          <div className={s.options__wrapper}>
            {this.renderOptions(type)}
          </div>
        )
    }
  }

  render() {
    var type = this.props.question.type;

    return (
      <div className={s.question__wrapper}>
        <h1 className={s.question__title}>{this.props.question.question}</h1>
        {this.renderGroup(type)}
      </div>
    );

  }
}


export default withStyles(LangQuestion, s);
