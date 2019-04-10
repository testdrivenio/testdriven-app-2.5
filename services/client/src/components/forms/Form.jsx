import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { registerFormRules, loginFormRules } from './form-rules.js';
import FormErrors from './FormErrors.jsx';


class Form extends Component {
  constructor (props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        email: '',
        password: ''
      },
      registerFormRules: registerFormRules,
      loginFormRules: loginFormRules,
      valid: false,
    };
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  };
  componentDidMount() {
    this.clearForm();
    this.validateForm();
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm();
      this.validateForm();
    };
  };
  clearForm() {
    this.setState({
      formData: {username: '', email: '', password: ''}
    });
  };
  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.validateForm();
  };
  handleUserFormSubmit(event) {
    event.preventDefault();
    const formType = this.props.formType
    const data = {
      email: this.state.formData.email,
      password: this.state.formData.password
    };
    if (formType === 'Register') {
      data.username = this.state.formData.username
    };
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType.toLowerCase()}`;
    axios.post(url, data)
    .then((res) => {
      this.clearForm();
      this.props.loginUser(res.data.auth_token);
    })
    .catch((err) => {
      if (formType === 'Login') {
        this.props.createMessage('User does not exist.', 'danger');
      };
      if (formType === 'Register') {
        this.props.createMessage('That user already exists.', 'danger');
      };
    });
  };
  validateForm() {
    // define self as this
    const self = this;
    // get form data
    const formData = this.state.formData;
    // reset all rules
    self.resetRules()
    // validate register form
    if (self.props.formType === 'Register') {
      const formRules = self.state.registerFormRules;
      if (formData.username.length > 5) formRules[0].valid = true;
      if (formData.email.length > 5) formRules[1].valid = true;
      if (this.validateEmail(formData.email)) formRules[2].valid = true;
      if (formData.password.length > 10) formRules[3].valid = true;
      self.setState({registerFormRules: formRules})
      if (self.allTrue()) self.setState({valid: true});
    }
    // validate login form
    if (self.props.formType === 'Login') {
      const formRules = self.state.loginFormRules;
      if (formData.email.length > 0) formRules[0].valid = true;
      if (formData.password.length > 0) formRules[1].valid = true;
      self.setState({loginFormRules: formRules})
      if (self.allTrue()) self.setState({valid: true});
    }
  };
  allTrue() {
    let formRules = loginFormRules;
    if (this.props.formType === 'Register') {
      formRules = registerFormRules;
    }
    for (const rule of formRules) {
      if (!rule.valid) return false;
    }
    return true;
  };
  resetRules() {
    const registerFormRules = this.state.registerFormRules;
    for (const rule of registerFormRules) {
      rule.valid = false;
    }
    this.setState({registerFormRules: registerFormRules})
    const loginFormRules = this.state.loginFormRules;
    for (const rule of loginFormRules) {
      rule.valid = false;
    }
    this.setState({loginFormRules: loginFormRules})
    this.setState({valid: false});
  };
  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    };
    let formRules = this.state.loginFormRules;
    if (this.props.formType === 'Register') {
      formRules = this.state.registerFormRules;
    }
    return (
      <div>
        {this.props.formType === 'Login' &&
          <h1 className="title is-1">Log In</h1>
        }
        {this.props.formType === 'Register' &&
          <h1 className="title is-1">Register</h1>
        }
        <hr/><br/>
        <FormErrors
          formType={this.props.formType}
          formRules={formRules}
        />
        <form onSubmit={(event) => this.handleUserFormSubmit(event)}>
          {this.props.formType === 'Register' &&
            <div className="field">
              <input
                name="username"
                className="input is-medium"
                type="text"
                placeholder="Enter a username"
                required
                value={this.state.formData.username}
                onChange={this.handleFormChange}
              />
            </div>
          }
          <div className="field">
            <input
              name="email"
              className="input is-medium"
              type="email"
              placeholder="Enter an email address"
              required
              value={this.state.formData.email}
              onChange={this.handleFormChange}
            />
          </div>
          <div className="field">
            <input
              name="password"
              className="input is-medium"
              type="password"
              placeholder="Enter a password"
              required
              value={this.state.formData.password}
              onChange={this.handleFormChange}
            />
          </div>
          <input
            type="submit"
            className="button is-primary is-medium is-fullwidth"
            value="Submit"
            disabled={!this.state.valid}
          />
        </form>
      </div>
    )
  };
};

export default Form;
