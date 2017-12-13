import React from 'react';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';

export default (props) => (
  <IconButton
    color="accent"
    onClick={props.onClick}
    >
    <SearchIcon className='search-icon'/>
  </IconButton>
);
