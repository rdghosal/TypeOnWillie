import React, { useContext, useState, useEffect, useRef } from "react";

type IResultModalProps = {
	completeLines : string[]
};


const ResultModal: React.FC<IResultModalProps> = ({ completeLines }) => {
	// line, incorrect words

	const makeResultText = () : { "__html": string; } => {
		const lines: string[] = completeLines.map((line:string, i:number) => { return `<p key=${i}>${line}</p>` });
		return { "__html" : lines.join("\n") };
	}

	return (
		<div className="results container" dangerouslySetInnerHTML={ makeResultText() }>
		</div>
	);
}

export default ResultModal;
