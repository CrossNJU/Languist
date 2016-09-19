/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangItem.scss';

import ListItem from "material-ui/List/ListItem";
import Toggle from "material-ui/Toggle";
import LangQuestion from '../LangQuestion';

function getQuestionData(lang) {
  return [
    {
      question: "How are you good at " + lang,
      type: "radio",
      options: [
        {
          option: "I've just started",
          value: "0"
        },
        {
          option: "I've developed 1~2 " + lang + " projects",
          value: "1"
        },
        {
          option: "I've developed 3~5 " + lang + " projects",
          value: "2"
        },
        {
          option: "I am quite experienced in " + lang,
          value: "3"
        }
      ]
    },

    {
      question: "What do you do with " + lang,
      type: "checkbox",
      options: [
        {
          option: "Web Applications",
          value: '0'
        },
        {
          option: "Desktop Applications",
          value: '1'
        },
        {
          option: "Data Process",
          value: '2'
        },
        {
          option: "Algorithm",
          value: '3'
        },
        {
          option: "Mobile Applications",
          value: '4'
        },
        {
          option: "Server",
          value: '5'
        },
        {
          option: "Websites",
          value: '6'
        },
        {
          option: "Operating System",
          value: '7'
        },
        {
          option: "Science",
          value: '8'
        },
        {
          option: "Linux",
          value: '9'
        },
        {
          option: "Packager Manager",
          value: '10'
        },
        {
          option: "Data Mining",
          value: '11'
        },
        {
          option: "Analysis",
          value: '12'
        },
        {
          option: "Other",
          value: '13'
        }
      ],
      languageOption: {
        JavaScript: [0, 6, 5, 3, 1, 4],

        HTML: [0, 6, 1, 4],

        CSS: [0, 6, 1, 4, 13],

        Python: [0, 6, 1, 4, 5, 3, 7, 8, 13],

        Java: [0, 6, 1, 4, 5, 3, 13],

        Ruby: [5, 6, 0, 13],

        PHP: [0, 6, 1, 4, 7, 13],

        'C++': [1, 5, 3, 0, 13],

        'C#': [6, 0, 5, 13],

        C: [5, 3, 7, 13],

        Shell: [9, 10, 13],

        'Objective-C': [4, 10, 13],

        R: [8, 11, 12, 3, 13],

        Swift: [4, 3, 13],

        Go: [5, 1, 0, 4, 13]
      }
    },
  ]
}

class LangItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      level: 0,
      questionData1: {},
      questionData2: {},
    };
  }

  componentWillMount() {
    let data = getQuestionData(this.props.lang.name);
    this.setState({
      isSelected: this.props.lang.isSelected,
      level: this.props.lang.level,
      questionData1: data[0],
      questionData2: data[1]
    })
  }

  componentWillReceiveProps(nextProps) {
    let data = getQuestionData(nextProps.lang.name);
    this.setState({questionData1: data[0], questionData2: data[1]});
  }


  handleClick() {
    let isSelected = !this.refs.toggle.state.switched;
    this.setState({isSelected: isSelected});
    this.props.lang.isSelected = isSelected;
    this.props.handleChange(this.props.lang);
  }
  ;

  handleQuestion(level) {
    this.setState({level: level});
    this.props.lang.level = level;
    this.props.handleChange(this.props.lang);
  }

  renderRepos() {
    if (this.props.lang.repos) {
      return (
        <div className={s['lang__list__item__right']}>
          <img src={require('./logo-s@2x.png')}/>
          <p>{this.props.lang.repos}</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className={s.root}>
        <ListItem onTouchTap={this.handleClick.bind(this)}>
          <div className={s['lang__list__item']}>
            <div className={s['lang__list__item__left']}>
              <Toggle style={{width: 'auto'}}
                      ref="toggle"
                      label={this.props.lang.name}
                      labelPosition="right"
                      defaultToggled={this.state.isSelected}/>
            </div>
            {this.renderRepos()}
          </div>
        </ListItem>
        <div className={s.lang__questions} ref="question" style={{display: this.state.isSelected ? "block" : "none"}}>
          <LangQuestion question={this.state.questionData1} defaultLevel={this.state.level.toString()}
                        onChoose={this.handleQuestion.bind(this)} language={this.props.lang.name}/>
          <LangQuestion question={this.state.questionData2}  language={this.props.lang.name}/>
        </div>
      </div>
    )
  }
}

export default withStyles(LangItem, s);
