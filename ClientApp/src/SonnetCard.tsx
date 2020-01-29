import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Sonnet from "./Sonnet";

const SonnetCard: React.FC = () => {

    return (
        <Link to="/app/:sonnet1" component={Sonnet}>
            <div className="sonnet-card">
                <div className="sonnet-card__title">
                    Sonnet I
                </div>
                <div className="sonnet-card__line">
                    <span className="line__first-letter">F</span>rom fairest creatures we desire increase...
                </div>
            </div>
        </Link>
    );
}

export default SonnetCard;