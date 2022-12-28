import React, { Component } from "react";
import axios from 'axios';

import './incrustForm.css';

class TransferForm extends Component {

    state = {
        amount: '',
        receiver: '',
      };
    
      handleTransfer = (event) => {
        event.preventDefault();
        const amount = this.state.amount;
        const receiver=this.state.receiver;
        const username = this.props.get_info().username;

        const info = { username, amount,receiver }
    
        axios.post('/transfer', info)
          .then((res) => {
            if (res.data.valid) {
                
              this.props.on_transfer(res.data);
            }
          })
          .catch(err => {
            console.error(err);
          });
    
        this.setState({ amount:'',receiver:'' });
    
      }
    
      handleInputChange = (event) => {
        const { name, value } = event.target;
    
        this.setState({
          [name]: value
        });
      };
    render(){
        return (
            <div>
                <div className=" center incrust">
                    <form  onSubmit={this.handleTransfer}>
                        <div className="txt_field">
                            <input type='number' step="any" min="1000" max="100000000" value={this.state.amount} name="amount" onChange={this.handleInputChange} required />
                            <span></span>
                            <label>amount</label>
                        </div>
                        <div className="txt_field">
                            <input type="text" value={this.state.receiver} name="receiver" onChange={this.handleInputChange}  required />
                            <span></span>
                            <label>receiver username</label>
                        </div>
                        <input type="submit" value="transfer" />
                    </form>
                </div>
            </div>
        );
    }
   
}

export default TransferForm;