import React from 'react';

export default (props) => {
  if (props.loadingGif) {
    return <div></div>
  }
  return (
    <div>
      <img src={props.gifUrl} className='gif' alt='gif' />
    </div>
  );
}
