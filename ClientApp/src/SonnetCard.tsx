import React, { useContext, useState, useEffect, CSSProperties } from "react";
import { Sonnet, HistoryFlag } from "./Sonnet";
import { RouteComponentProps, withRouter } from "react-router";
import { MainContext } from "./Main";
// import TypeSession from "./TypeSession";

interface Props extends RouteComponentProps {
    sonnet: Sonnet,
    focusSonnet: React.Dispatch<React.SetStateAction<Sonnet | null>>
}

const SonnetCard: React.FC<Props> = ({ history, sonnet, focusSonnet }): JSX.Element => {

    const [style, setStyle] = useState<CSSProperties>({ color: "blue", fontWeight: "bolder" } as CSSProperties);

    useEffect(() => {

        if (sonnet.hasHistory === HistoryFlag.TRUE) {
            setStyle({ color: "red"} as CSSProperties);
        }
        
    }, [sonnet]);

    return (
        <div className="sonnet-card" onClick={() => focusSonnet(sonnet) }>
            {
                <div className="sonnet-card__title" style={style}>
                    { sonnet.title }
                </div>
            }
            <div className="sonnet-card__line">
                { sonnet.lines[0] + "..."}
            </div>
        </div>
    );
}

export default withRouter(SonnetCard);