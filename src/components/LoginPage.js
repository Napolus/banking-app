import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { Logo } from './Logo';


class LoginPage extends Component {

  state = {
    username: '',
    password: '',
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    const info = { username, password }

    axios
      .post('/', info)
      .then((res) => {
        if (res.data.valid) {
          this.props.on_login(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });

    this.setState({ username: "", password: "" });

  }

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  render() {

    if (this.props.get_info().valid) {
      return <Navigate replace to='./dashboard' />
    } else {
      return (
        <div className="login-page">
          {Logo()}
          <div className="center">
            <h1>Login</h1>
            <form onSubmit={this.handleLogin}>
              <div className="txt_field">
                <input type="text" value={this.state.username} name="username" onChange={this.handleInputChange} required />
                <span></span>
                <label>Username</label>
              </div>
              <div className="txt_field">
                <input type="password" value={this.state.password} name="password" onChange={this.handleInputChange} required />
                <span></span>
                <label>Password</label>
              </div>
              <div className="pass">Forgot Password?</div>
              <input type="submit" value="Login" />
              <div className="signup_link">
                Not a member? <Link to='/register'>Signup</Link>
              </div>
            </form>
          </div>
        </div>
      )
    }
  }


}

export default LoginPage;