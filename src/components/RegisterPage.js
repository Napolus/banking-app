import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { Logo } from './Logo';


class RegisterPage extends Component {

  state = {
    username: '',
    password: '',
    cpassword: '',
    is_valid: false
  };

  handleRegister = (event) => {
    event.preventDefault();
    const { username, password,cpassword} = this.state;

    if(password!==cpassword){
      return;
    }
    const info = { username, password }

    axios.post('/register', info)
      .then((oui) => { this.setState({ is_valid: oui.data }) })
      .catch(err => {
        console.error(err);
      });

    this.setState({ username: "", password: "",cpassword:""});

  }

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      (this.state.is_valid)?<Navigate replace to="/" />:
      <div className="login-page">
        {Logo()}
        <div className="center">
          <h1>Register</h1>
          <form onSubmit={this.handleRegister}>
            <div className="txt_field">
              <input type="text"
                name='username'
                value={this.state.username}
                onChange={this.handleInputChange}
                required />
              <span></span>
              <label>Username</label>
            </div>
            <div className="txt_field">
              <input type="password"
                name='password'
                value={this.state.password}
                onChange={this.handleInputChange}
                required />
              <span></span>
              <label>Password</label>
            </div>
            <div className="txt_field">
              <input type="password"
                name='cpassword'
                value={this.state.cpassword}
                onChange={this.handleInputChange}
                required />
              <span></span>
              <label> confirm Password</label>
            </div>
            <input type="submit" value="Register" />
            <div className="signup_link">
              already member? <Link to="/">Signin</Link>
            </div>
          </form>
        </div>

      </div>
    )
  }

}

export default RegisterPage;