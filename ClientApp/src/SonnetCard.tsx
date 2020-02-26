import React from "react";
// import { Link, useRouteMatch } from "react-router-dom";
import Sonnet from "./Sonnet";
// import TypeSession from "./TypeSession";

type Props = {
    sonnet: Sonnet
}

const SonnetCard : React.FC<Props> = ({ sonnet }) : JSX.Element => {

    return (
        <div className="sonnet-card" onClick={() => window.location.href = `/app/${sonnet.id}`}>
            <div className="sonnet-card__title">
                { sonnet.title }
            </div>
            <div className="sonnet-card__line">
                { sonnet.text[0] }
            </div>
        </div>
    );
}

export default SonnetCard;