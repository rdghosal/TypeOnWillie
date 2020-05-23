import React, { useContext } from "react";
import Sonnet from "./Sonnet";
import { RouteComponentProps, withRouter } from "react-router";
import { MainContext } from "./Main";
// import TypeSession from "./TypeSession";

interface Props extends RouteComponentProps {
    sonnet: Sonnet,
    focusSonnet: React.Dispatch<React.SetStateAction<Sonnet | null>>
}

const SonnetCard: React.FC<Props> = ({ history, sonnet, focusSonnet }): JSX.Element => {

    return (
        <div className="sonnet-card" onClick={() => focusSonnet(sonnet) }>
            <div className="sonnet-card__title">
                { sonnet.title }
            </div>
            <div className="sonnet-card__line">
                { sonnet.lines[0] + "..."}
            </div>
        </div>
    );
}

export default withRouter(SonnetCard);