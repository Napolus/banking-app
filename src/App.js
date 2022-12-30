import React, { Component } from 'react';
import axios from 'axios';

import './App.css';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import DepositForm from './components/depositForm';
import WithdrawForm from './components/withdrawForm';
import TransferForm from './components/transfertForm';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

class App extends Component {

  state = JSON.parse(window.localStorage.getItem('state'))
    || {
    username: '',
    valid: false,
    balance: 0.0,
  }

  
  constructor(props) {

    
    super(props);
    setInterval(() => {
      if (this.state.valid) {
        var username = this.state.username;
        const info = { username }
        axios.post('/balance', info)
          .then((res) => {
            if (res.data.valid) {

              this.csetState({ ...this.state, balance: res.data.balance })
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }, 10000);
  }

  csetState = (state) => {
    window.localStorage.setItem('state', JSON.stringify(state));
    super.setState(state);
  }

  onLogin = (data) => {
    this.csetState({
      ...this.state,
      username: data.username,
      valid: data.valid,
      balance: data.balance,
    })

  }

  onLogout = () => {
    this.csetState({ ...this.state, username: '', valid: false })
  }

  onRegister = () => {

  }

  onDeposit = (data) => {
    this.csetState({ ...this.state, balance: data.balance })

  }

  onWithdraw = (data) => {
    this.csetState({ ...this.state, balance: data.balance })

  }

  onTransfer = (data) => {
    this.csetState({ ...this.state, balance: data.balance })

  }

  getInfo = () => {
    return this.state;
  }

   

  render() {
    
    return (
      <div className='App'>
        <Routes>
          <Route path={this.props.base_url+"/"} element={<LoginPage  on_login={this.onLogin} get_info={this.getInfo} />} />
          <Route path={this.props.base_url+"/register"} element={<RegisterPage  on_register={this.onRegister} get_info={this.getInfo} />} />
          <Route path={this.props.base_url+"/dashboard"} element={<Dashboard on_logout={this.onLogout} get_info={this.getInfo} />}>
            <Route path={this.props.base_url+"/dashboard/deposit"} element={<DepositForm on_deposit={this.onDeposit} get_info={this.getInfo} />} />
            <Route path={this.props.base_url+"/dashboard/withdraw"} element={<WithdrawForm on_withdraw={this.onWithdraw} get_info={this.getInfo} />} />
            <Route path={this.props.base_url+"/dashboard/transfer"} element={<TransferForm on_transfer={this.onTransfer} get_info={this.getInfo} />} />
          </Route>
        </Routes>
      </div>
    );
  }

}

export default App;
