import React, { FormEvent, useContext, Fragment } from 'react'
import { RouteComponentProps } from 'react-router';
import { AppContext } from './App';
import Navbar from './Navbar';

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

enum EntryType {
    username = 1,
    password = 2 
}

class HighestEducation {
    public static highSchool = "high school";
    public static college = "college";
    public static gradSchool = "graduate school";
}

const Register = (props : RouteComponentProps) => {

    const { setUser } = useContext(AppContext);

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = false;

        const form = document.getElementById("register") as HTMLFormElement;
        const formData = new FormData(form);

        // Non-nullable entries
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const confirmation = formData.get("confirmation") as string;

        // Nullable entries
        const age = formData.get("age") as string;
        const highestEducation = formData.get("highestEducation") as string;
        const nationality = formData.get("nationality") as string;
        
        [ username, password, confirmation ].forEach(item => {
            if (!item) {
                alert("Must fill in username, password, confirmation");
                return isValid;
            }
        });

        // Verify data
        if (!verifyEntry(password, EntryType.password)) {
            alert("Password must contain 8-12 characters, including one of each of the following:\n\
            lowercase letter, uppercase letter, a number, and special character");
        } else if (password !== confirmation) {
            alert("Password and Confirmation fields do not match!");
        } else if (!verifyEntry(username, EntryType.username)) {
            alert("Username must start with letter and contain zero spaces.");
        } else if (age && isNaN(parseInt(age))) {
            alert("Age must be a number!");
        } else {
            // Send to registration endpt
            console.log(formData.get("password"))
            fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    age: parseInt(age),
                    highestEducation,
                    nationality
                })
            }).then(response => {
                if (!response.ok) {
                    alert("Check registration form and try again.");
                    console.log(response.json())
                    return isValid;
                } else {
                    // Cache new user data
                    return props.history.push("/login");
                }
            }).catch(err => {
                alert("A network connection error occurred.\nPlease try again.");
            });
        }

        return isValid;
    }

    return (
        <Fragment>
            <Navbar />
            <div className="register container">
                <h2 className="form__title">Registration</h2>
                <form onSubmit={ handleSubmit } id="register">
                    <h3 className="form__subtitle">Required</h3>
                    <div className="form-group">
                        <label htmlFor="username">Your username of up to 12 <strong>letters</strong> and <strong>numbers</strong></label>
                        <input type="text" className="form-control" placeholder="Username" name="username" id="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password of at least 8 characters with one of each:<br/>
                                                Lowercase letter, uppercase letter, number, special character</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Password"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmation">Your password once more</label>
                        <input type="password" className="form-control" name="confirmation" id="confirmation" placeholder="Password (again)"/>
                    </div>
                    <hr/>
                    <h3 className="form__subtitle">Optional</h3>
                    <div className="form-group">
                        <label htmlFor="confirmation">Your age</label>
                        <input type="text" className="form-control" name="age" id="age" placeholder="Age"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nationality">Your nationality</label>
                        <select name="nationality" className="form-control" id="nationality">
                        {
                            COUNTRIES.map((country:string, index:number) =><option value={country} key={index}>{ country }</option>)
                        }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="highestEducation">Your highest education</label>
                        <select name="highestEducation" className="form-control" id="highestEducation">
                            <option value={HighestEducation.highSchool}>High school</option>
                            <option value={HighestEducation.college}>College / university</option>
                            <option value={HighestEducation.gradSchool}>Graduate school (Masters/PhD)</option>
                        </select>
                    </div>
                    <button  className="btn btn-primary" type="submit">Register</button>
                    <button className="btn btn-secondary" type="button"
                        onClick={() => props.history.push("/login") }>Back to Log In</button>
                </form>
            </div>
        </Fragment>
    )
}

function verifyEntry(entry: string, type: number) : boolean {
    let regex : RegExp;
    switch (type) {
        case EntryType.password:
            regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
            break;
        default: // Username
            regex = /^[A-Za-z]\S{1,12}$/;
            break;
    }

    let isValid = entry.match(regex) ? true : false;
    return isValid;
}


export default Register;
