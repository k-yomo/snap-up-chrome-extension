import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import red from 'material-ui/colors/red';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

const styles = theme => ({
  formControl: {
    marginTop: 5,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    },
  }
});

const TextField = (props) => (
      <FormControl className={props.classes.formControl}>
        <InputLabel
          FormControlClasses={{
            focused: props.classes.inputLabelFocused,
          }}
        >
          {props.label}
        </InputLabel>
        <Input
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
