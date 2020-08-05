import React, { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'
import { bankOne, matrixBanks } from "./banks";

const Pad = ({id, keyTrigger, keyCode, url, vol, onPlay }) => {
	const [audio, setAudio] = React.useState(null);
	const [isPlaying, setIsPlaying] = React.useState(false);
	React.useEffect(() => {
		const audio = document.getElementById(keyTrigger);
		setAudio(audio);
		audio.addEventListener('ended', (e) => {
			setIsPlaying(false);
		});
		const handlerKeyDown = (e) => {
			playAudio(e.key);
		};
		
		document.addEventListener('keydown', handlerKeyDown)
		return () => {
			document.removeEventListener('keydown', handlerKeyDown);
		};
	}, [audio]);
	const playAudio = (key) => {
        //audio.currentTime = 0;
		if(key && key.toUpperCase() === keyTrigger){
			setIsPlaying(true);
			audio.play();
			onPlay(id);
		} else if (!key) {
			setIsPlaying(true);
			audio.play();
			onPlay(id);
		}
	};
    return (
        <div 
			className="drum-pad" 
			id={id}
			onClick={(e) => {
					playAudio();
				}}
		>
            <Button 
				variant={`outline-dark ${isPlaying ? 'active' : ''} p-4 m-2`}
			>
				{keyTrigger}
			</Button>
			<audio src={url} className="clip" id={keyTrigger}></audio>
        </div>
    );
};

const DrumMachine = ({vol, onPlay}) => {
	const banks = matrixBanks(bankOne);
    return (
        <div id="drum-machine">
			{banks.map((row, index) => (
				<Row className="">
					{row.map(({ id, keyCode, keyTrigger, url }) => (
						<Col xs="3" md="3">
							<Pad
								id={id}
								keyCode={keyCode}
								keyTrigger={keyTrigger}
								url={url}
								vol={vol}
								onPlay={onPlay}
								/>
						</Col>
					))}
				</Row>
			))}
        </div>
    );
};
const App = () => {
	const [currentBank, setCurrentBank] = React.useState('')
	return(
		<div id="container" className="container">
			<h1>Drum Machine</h1>
			<Row>
				<Col>
					<DrumMachine  vol={1} onPlay={(id) => {
							setCurrentBank(id);
						}}/>
				</Col>	
				<Col>
					<div id="display"> { currentBank }</div>
				</Col>
			</Row>

		</div>
	)
};
export default App;
