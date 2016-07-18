/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangList.scss';

import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import Toggle from "material-ui/Toggle";
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';

let questionData1 = {
  question: "How are you good at JavaScript",
  type: "radio",
  options: [
    {
      option: "I've just started",
      value: 0
    },
    {
      option: "I've developed 1~2 JavaScript projects",
      value: 1
    },
    {
      option: "I've developed 3~5 JavaScript projects",
      value: 2
    },
    {
      option: "I am quite experienced in JavaScript",
      value: 3
    }
  ]
};

let questionData2 = {
  question: "What do you do with JavaScript",
  type: "checkbox",
  options: [
    {
      option: "Web applications",
      value: 0
    },
    {
      option: "Desktop applications",
      value: 1
    },
    {
      option: "Data process",
      value: 2
    },
    {
      option: "Algorithm",
      value: 3
    }
  ]
};

class LangItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isSelected: this.props.lang.isSelected};
  }

  handClick() {
    if (!this.refs.toggle.state.switched) {
      this.setState({isSelected: true});
    } else {
      this.setState({isSelected: false});
    }
  };

  render() {
    return (
      <div>
        <ListItem>
          <div className={s['lang__list__item']}>
            <div className={s['lang__list__item__left']}>
              <Toggle style={{width: 'auto'}}
                      ref="toggle"
                      label={this.props.lang.name}
                      labelPosition="right"
                      defaultToggled={this.state.isSelected}
                      onToggle={this.handClick.bind(this)}/>
            </div>
            <div className={s['lang__list__item__right']}>
              <img src={require('./logo-s@2x.png')}/>
              <p>{this.props.lang.repoNum}</p>
            </div>
          </div>
        </ListItem>
        <div className={s.lang__questions} ref="question" style={{display: this.state.isSelected?"block":"none"}}>
          <LangQuestion question={questionData1}/>
          <LangQuestion question={questionData2}/>
        </div>
      </div>
    )
  }
}

class LangQuestion extends Component {
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
        <ButtonGroup className={s.options__wrapper} name={this.props.question.question} defaultSelected="not_light">
          {this.renderOptions(this.props.question.type)}
        </ButtonGroup>
      </div>
    );

  }
}


class LangList extends Component {
  renderLanguage() {
    return this.props.langData.map(lang => {
      return (
        <LangItem lang={lang}/>
      )
    })
  }

  render() {
    return (
      <List className={s.root}
            style={{padding:'0px'}}>
        {this.renderLanguage()}
      </List>
    )
  }
}

export default withStyles(LangList, s);
