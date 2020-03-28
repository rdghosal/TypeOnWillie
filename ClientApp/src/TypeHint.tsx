import React from 'react';

type TypeHintProps = {
    endOfLine: boolean
}

const TypeHint = ({ endOfLine } : TypeHintProps) => {
    return (
        <div className="typesession__type-hint">
            <p className="type-hint__msg">
                After typing, hit <span className="type-hint__msg--key-name">{ endOfLine ? "Enter" : "Space" }</span>
            </p>
        </div>
    )
}

export default TypeHint;
