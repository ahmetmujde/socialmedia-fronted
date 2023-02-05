import React from "react";
import {singup} from "../api/apiCalls";
import Input from "../components/Input" 

class UserSingupPage extends React.Component {

    state = {
        username : null,
        displayName : null,
        password: null,
        passwordValidate: null,
        pendingApicall : false,
        errors : {}
    };

    onChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        const errors = { ... this.state.errors};
        errors[name] = undefined;
        if (name === 'password' || name === 'passwordValidate') {
            if (name === 'password'  && value != this.state.passwordValidate) {
                errors.passwordValidate = 'Password mismatch!'
            } else if (name === 'passwordValidate'  && value != this.state.password) {
                errors.passwordValidate = 'Password mismatch!'
            } else {
                errors.passwordValidate = undefined;
            }
        }
        this.setState({
            [name] : value,
            errors
        });
    };

    onClickSignup = async event => {
        event.preventDefault();

        const {username, displayName, password, passwordValidate } = this.state;

        const body = {
            username,
            displayName,
            password
        };

        this.setState({ pendingApicall : true});
       
        try {
            const response = await singup(body);
        } catch (error) {
            if (error.response.data.validationErrors) {
                this.setState({ errors: error.response.data.validationErrors});
            }
        }

        this.setState({pendingApicall : false}); 
        
    };

    render(){
        const { pendingApicall} = this.state;
        return (
            <div className="container">
                <form>
                    <h1 className="text-center">Sing Up</h1>

                    <Input name="username" label="Username" error={this.state.errors.username} onChange={this.onChange} />
                    
                    <Input name="displayName" label="Display Name" error={this.state.errors.displayName} onChange={this.onChange} />

                    <Input name="password" label="Password" error={this.state.errors.password} onChange={this.onChange} type="password"/>

                    <Input name="passwordValidate" label="Password Validate" error={this.state.errors.passwordValidate} onChange={this.onChange} type="password"/>

                    <div className="text-center">
                        <button className = "btn btn-primary" onClick={this.onClickSignup} disabled = {pendingApicall || this.state.errors.passwordValidate != undefined}>
                            {pendingApicall && <span className="spinner-border spinner-border-sm"></span>} Sing Up</button>
                    </div>

                </form>
            </div>
        )
    }
}

export default UserSingupPage;