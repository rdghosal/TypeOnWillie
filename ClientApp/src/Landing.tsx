import React from "react";
import "./Landing.css";

const Landing: React.FC = () => {
    return (
        <div className="landing__container">
            <p className="landing__brand">Type On Willie!</p>
            <img className="landing__img" src="../public/shakespeare.jpg" alt="image of Shakespeare" />
            <p className="landing__desc">
                What if William Shakespeare lived in the modern day?<br/>
                What would become of his Sonnets--those pearls of charming creativity that have withstood the test of Time--<br/>
                Why, he'd have to type them up, of course.
                Help Willie salvage his work so that future generations may enjoy his work too.
                Type on, so that he may learn to type on too.
            </p>
            <button className="btn btn-primary"onClick={() => window.location.href = "/app"}>Onwards!</button>
        </div>
    );
}

export default Landing;