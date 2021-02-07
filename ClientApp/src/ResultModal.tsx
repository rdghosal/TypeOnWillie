import React, { useContext, useState, useEffect, useRef } from "react";

type IResultModalProps = {
	completeLines : string[]
};


const ResultModal: React.FC<IResultModalProps> = ({ completeLines }) => {
	// line, incorrect words
	return (
		<div className="results container">
			{
				completeLines.map((line:string, i:number) => { return <p key={i}>{line}</p> })
			}
		</div>
	);
}

export default ResultModal;
