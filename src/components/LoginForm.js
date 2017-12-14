import React, { Component } from 'react';
import Button from 'material-ui/Button';
import TextField from './TextField';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  onEmailChange(email) {
    this.setState({ email });
  }

  onPasswordChange(password) {
    this.setState({ password });
  }

  onSubmitForm() {
    this.props.loginToFirebase(this.state.email, this.state.password);
  }

  render() {
    const { email, password } = this.state
    return (
      <div className='login-container'>
        { this.props.error && <p>{this.props.error}</p>}
        <TextField
          label='Email adress'
          text={email}
          onChange={this.onEmailChange.bind(this)}
        />

        <TextField
          label='Password'
          text={password}
          onChange={this.onPasswordChange.bind(this)}
        />
        <Button
          disabled={!(email && password)}
          onClick={() => this.onSubmitForm()}
          style={{
            background: email && password ? 'linear-gradient(45deg, #EF5350 30%, #FF8E53 90%)' : '#BDBDBD',
            color: 'white',
            width: 145
          }}
        >
          Login
        </Button>
      </div>
    );
  }
};
