import React, { FormEvent, useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import { AppContext } from './App';


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
        }

        const jsonData =  JSON.stringify({ username, password });
        fetch("/api/login", {
            headers: { "Content-Type" : "application/json" },
            method: "POST",
            body: jsonData
        }).then(response => {
            if (response.ok) {
                const user = response.json();
                sessionStorage.setItem("user", JSON.stringify(user)); 
                setUser(user);
                isValid = true;
            }
        }).catch(err => {
            alert("Invalid username and/or password");
        });

        return isValid;
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
        <div className="login container" id="login">
            <form onSubmit={ handleSubmit }>
                <input type="text" name="username" id="username"/>
                <input type="password" name="password" id="password"/>
                <button type="submit">Login</button>
                <button type="button"
                    onClick={() => props.history.push("/register") }>Sign Up</button>
                <button type="button" onClick={ handleGuest }>Continue as Guest</button>
            </form>
        </div>
    );
}

export default withRouter(Login);
