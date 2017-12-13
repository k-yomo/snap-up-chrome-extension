import React from 'react';

export default (props) => {
  if (props.loadingGif) {
    return <div></div>
  }

  const eng = props.english.endsWith(' ') ?
  props.english.slice(0, -1) : props.english;
  return (
    <div>
      <img src={props.gifUrl} className='gif' />
    </div>
  );
}
