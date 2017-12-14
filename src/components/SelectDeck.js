import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import red from 'material-ui/colors/red';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 166,
  },
  inputLabelFocused: {
    color: red[400],
  },
  inputInkbar: {
    '&:before': {
      backgroundColor: red[400]
    },
    '&:after': {
      backgroundColor: red[400]
    },
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const SelectDeck = (props) => {
  const { classes } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel FormControlClasses={{
        focused: props.classes.inputLabelFocused,
      }}>Choose Deck</InputLabel>
      <Select
        value={props.deckId}
        onChange={props.onChange}
        input={<Input name="deckId" id="deckId" classes={{ inkbar: props.classes.inputInkbar }} />}
      >
        {props.decks.length > 0 ? props.decks.map(deck =>
          <MenuItem key={deck.id} value={deck.id}>{deck.title}</MenuItem>
        ) : <MenuItem value={0}>Chrome Extension</MenuItem>}
      </Select>
    </FormControl>
  );
}

SelectDeck.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectDeck);
