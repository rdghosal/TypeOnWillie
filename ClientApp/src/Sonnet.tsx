import React, { ReactNode } from "react";


// type SonnetProps = {
//     sonnetNumber: string;
//     children?: ReactNode;
// }

const Sonnet: React.FC = () => {
    return (
        <div className="sonnet">
            <h1>Sonnet 1</h1>
            <p>
                The fairest creatures we desire increase,
                That thereby beauty's rose might never die,
                But as the riper should by time decease,
                His tender heir might bear his memory:
                But thou, contracted to thine own bright eyes,
                Feed'st thy light'st flame with self-substantial fuel,
                Making a famine where abundance lies,
                Thyself thy foe, to thy sweet self too cruel.
                Thou that art now the world's fresh ornament
                And only herald to the gaudy spring,
                Within thine own bud buriest thy content
                And, tender churl, makest waste in niggarding.
                Pity the world, or else this glutton be,
                To eat the world's due, by the grave and thee.
            </p>
        </div>
    );
}

export default Sonnet;