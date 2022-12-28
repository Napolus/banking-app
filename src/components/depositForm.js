import React, { Component } from "react";
import axios from 'axios';

import './incrustForm.css';

class DepositForm extends Component {

    state = {
        amount: '',
      };
    
      handleDeposit = (event) => {
        event.preventDefault();
        const amount = this.state.amount;
        const username = this.props.get_info().username;

        const info = { username, amount }
    
        axios.post('/deposit', info)
          .then((res) => {
            if (res.data.valid) {
                
              this.props.on_deposit(res.data);
            }
          })
          .catch(err => {
            console.error(err);
          });
    
        this.setState({ amount:'' });
    
      }
    
      handleInputChange = (event) => {
        const { name, value } = event.target;
    
        this.setState({
          [name]: value
        });
      };

    render() {
        return (
            <div>
                <div className=" center incrust">
                    <form onSubmit={this.handleDeposit}>
                        <div className="txt_field">
                            <input type='number' step="any" min="1000" max="100000000" value={this.state.amount} name="amount" onChange={this.handleInputChange} required />
                            <span></span>
                            <label>amount</label>
                        </div>
                        <div className="methodOfPay">
                            <label htmlFor="methods">choisir la methode de depot</label>
                            <select name="method" id="methods">
                                <option value="orangeMoney">orangeMoney</option>
                                <option value="MoMo">MoMo</option>
                                <option value="yoomeeMoney">yoomeeMoney</option>
                            </select>
                        </div>
                        <div className="numberIndicator">
                            <p>veillez effectuer le paiement a ce numero: 65618****</p>
                        </div>
                        <input type="submit" value="Deposit" />
                    </form>
                </div>
            </div>
        );
    }
}

export default DepositForm;