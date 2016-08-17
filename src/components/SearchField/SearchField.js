/**
 * Created by chenm on 2016/7/14.
 */
import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './SearchField.scss';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';

const style = {
  searchIconStyle: {
    color: "grey",
    height: '30px',
    width: '30px',
  },

  searchBtnStyle: {
    height: '50px',
    width: '50px',
    marginRight: '18px',
  },

  searchInputStyle: {
    height: '58px'
  },
};


class SearchField extends Component {
  handleSearch() {
    let keywords = this.refs.input.input.value;
    this.props.handleSearch(keywords);
  }

  handleEnter(event) {
    if(event.key == 'Enter') {
      let keywords = this.refs.input.input.value;
      this.props.handleSearch(keywords);
    }
  }

  render() {
    return (
      <div className={s.SearchField} onKeyPress={this.handleEnter.bind(this)}>
        <TextField hintText="Choose languages you are good at or learning"
                   fullWidth={true}
                   underlineShow={false}
                   style={style.searchInputStyle}
                   inputStyle={{padding: '0 16px', boxSizing: 'border-box'}}
                   hintStyle={{bottom: '16px', padding: '0 16px'}}
                   ref="input"/>
        <IconButton style={style.searchBtnStyle} iconStyle={style.searchIconStyle} onClick={this.handleSearch.bind(this)}>
          <SearchIcon/>
        </IconButton>
      </div>
    )
  }
}

export default withStyles(SearchField, s);
