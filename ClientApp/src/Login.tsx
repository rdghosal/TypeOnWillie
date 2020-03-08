import React, { FormEvent, useContext, Fragment } from 'react'
import { RouteComponentProps } from 'react-router';
import { AppContext } from './App';
import Navbar from './Navbar';


const Login = (props : RouteComponentProps) => {

    const { user, setUser } = useContext(AppContext);

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => { 
        e.preventDefault(); // Prevent submision

        let isValid = false;
        const form = document.getElementById("login") as HTMLFormElement;
        const formData = new FormData(form);
        
        const username = formData.get("username");
        const password = formData.get("password");

        if (!username || !password) {
            alert("Must submit both username and password to login");
            return false;
        }

        const jsonData =  JSON.stringify({ username, password });
        fetch("/api/login", {
            headers: { "Content-Type" : "application/json" },
            method: "POST",
            body: jsonData
        }).then(response => {
            if (response.ok) {
                isValid = true;
                return response.json();
            }
        }).then(data => {
            sessionStorage.setItem("user", JSON.stringify(data)); 
            setUser(data);
            return props.history.push("/app");
        }).catch(err => {
            alert("Invalid username and/or password");
        });
    }

    const handleGuest = () =>  {
        // Set user as guest
        const guest = {
            id: "guest"
        };
        sessionStorage.setItem("user", JSON.stringify(guest));
        setUser(guest);
        props.history.push("/app");
    }
    
    return (
        <Fragment>
            <Navbar />
            <div className="login container">
                <h2 className="form__title">Login</h2>
                <form onSubmit={ handleSubmit } id="login">
                    <div className="form-group">
                        <label htmlFor="username">Your username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" id="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Your password</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Password"/>
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                    <button className="btn btn-secondary" type="button"
                        onClick={() => props.history.push("/register") }>Sign Up</button>
                    <button className="btn btn-warning" type="button" onClick={ handleGuest }>Continue as Guest</button>
                </form>
            </div>
        </Fragment>
    );
}

export default Login;
