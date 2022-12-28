import React, { Component } from "react";
import axios from 'axios';

import './incrustForm.css'

class WithdrawForm extends Component {


    state = {
        amount: '',
      };

    handleWithdraw = (event) => {
        event.preventDefault();
        const amount = this.state.amount;
        const username = this.props.get_info().username;

        const info = { username, amount }

        axios.post('/withdraw', info)
            .then((res) => {
                if (res.data.valid) {

                    this.props.on_withdraw(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });

        this.setState({ amount: '' });

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

                <div className="center incrust">
                    <form onSubmit={this.handleWithdraw}>
                        <div className="txt_field">
                            <input type="number"  step="any" min="1" max="100000000" value={this.state.amount} name="amount" onChange={this.handleInputChange} required />
                            <span></span>
                            <label>amount</label>
                        </div>
                        <div className="txt_field">
                            <input type="text" />
                            <span></span>
                            <label>withdraw number</label>
                        </div>
                        <div className="methodOfPay">
                            <label htmlFor="methods">choisir la methode de retrait</label>
                            <select name="method" id="methods">
                                <option value="orangeMoney">orangeMoney</option>
                                <option value="MoMo">MoMo</option>
                                <option value="yoomeeMoney">yoomeeMoney</option>
                            </select>
                        </div>

                        <input type="submit" value="withdraw" />
                    </form>
                </div>
            </div>
        );
    }

}

export default WithdrawForm;