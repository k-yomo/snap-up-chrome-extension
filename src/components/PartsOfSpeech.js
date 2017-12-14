import React from 'react';
import Button from 'material-ui/Button';

const parts = ['N', 'V', 'Adj', 'Adv', 'N/A'];
const partsColorsPair = {
  N: '#EF5350',
  V: '#F37C4A',
  Adj: '#F7A644',
  Adv: '#FCD63D',
  'N/A': '#888'
}

export default (props) => (
  <div style={{ margin: 'auto', textAlign: 'center' }}>
    {parts.map((part, i) =>
      <Button
        key={i}
        onClick={() => props.onClick(part)}
        style={{
          maxWidth: 36,
          minWidth: 36,
          maxHeight: 36,
          minHeight: 36,
          margin: 5,
          padding: 10,
          color: 'white',
          backgroundColor: props.wordInfo.parts && props.wordInfo.parts.includes(part) ? partsColorsPair[part] : '#BDBDBD'
        }}
      >
        {part}
      </Button>
    )}
  </div>
);
