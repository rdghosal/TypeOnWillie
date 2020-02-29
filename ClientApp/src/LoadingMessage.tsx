import React from 'react'

type LoadingMessageProps = {
    insertText:string
}


export const LoadingMessage = ({ insertText } : LoadingMessageProps) => {
    return (
        <div>
            <p className="loading-message__text">Loading your { insertText }...</p>
        </div>
    )
}
