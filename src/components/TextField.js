import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import red from 'material-ui/colors/red';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
  },
  inputLabelFocused: {
    color: red[400],
  },
  inputInkbar: {
    '&:before': {
      backgroundColor: red[400],
    },
    '&:after': {
      backgroundColor: red[400],
    },
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  }
});

const TextField = (props) => (
      <FormControl className={props.classes.formControl}>
        <InputLabel
          FormControlClasses={{
            focused: props.classes.inputLabelFocused,
          }}
          htmlFor="custom-color-input"
        >
          New English Word
        </InputLabel>
        <Input
          id="custom-color-input"
          classes={{ inkbar: props.classes.inputInkbar }}
          value={props.text}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </FormControl>
    );


TextField.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TextField);
