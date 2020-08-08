import React, { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import { 
	matrixSamples, 
	banks, 
	BANK_ONE, 
	BANK_TWO 
} from "./banks";

const Pad = ({id, keyTrigger, url, volume, onPlay }) => {
	const [audio, setAudio] = React.useState(null);
	
	const [isPlaying, setIsPlaying] = React.useState(false);
	console.log('PAD volume ', volume)
	React.useEffect(() => {
		const audio = document.getElementById(keyTrigger);
		setAudio(audio);
		
		audio.addEventListener('ended', (e) => {
			setIsPlaying(false);
		});
		const handlerKeyDown = (e) => {
			handlePlayAudio(e.key);
		};
		
		
		
		
		document.addEventListener('keydown', handlerKeyDown)
		return () => {
			document.removeEventListener('keydown', handlerKeyDown);
		};
	}, [audio, volume]);

	const handlePlayAudio = (key) => {
		if(key && key.toUpperCase() === keyTrigger){
			playAudio();
		} else if (!key) {
			playAudio();
		}
	};
	const playAudio = () => {
		console.log('Pad  playAudio volume' , volume)
		audio.volume = volume;
		audio.currentTime = 0;
		audio.play();
		setIsPlaying(true);
		onPlay(id);
	};
    return (
        <div 
			className="drum-pad" 
			id={id}
			onClick={(e) => {
					handlePlayAudio();
				}}
		>
            <Button 
				variant={`outline-dark ${isPlaying ? 'active' : ''} p-4 m-2`}
			>
				{keyTrigger}
			</Button>
			<audio 
				src={url} 
				className="clip" 
				id={keyTrigger}
			></audio>
        </div>
    );
};

const DrumMachine = ({ volume, onPlay, currentBank }) => {
    const banks = matrixSamples(currentBank);
    console.log("Drume machine volume: ", volume);
    return (
        <div id="drum-machine">
            {banks.map((row, index) => (
                <Row key={index}>
                    {row.map(({ id, keyCode, keyTrigger, url }) => (
                        <Col xs="3" md="3" key={id}>
                            <Pad
                                id={id}
                                keyCode={keyCode}
                                keyTrigger={keyTrigger}
                                url={url}
                                volume={volume}
                                onPlay={onPlay}
                            />
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    );
};
const Controls = ({currentSampleLabel, onBankChange, onVolumeChange}) => {
	const [rangeValue, setRangeValue] = React.useState(INIT_VOLUME)
	const [radioValue, setRadioValue] = React.useState(BANK_ONE)
	const radios = [
		{name: 'Bank 1', value: BANK_ONE},
		{name: 'Bank 2', value: BANK_TWO},
	];
	const handleChange = (bank) => {
		setRadioValue(bank);
		onBankChange(bank);
	};
	const handleRange = (value) => {
		//console.log(value / 100);
		onVolumeChange(value / 100);
		setRangeValue(value);


	};
	return (
		<>
			<div id="display"> </div>
			<Alert variant='secondary' id="display">
				{ currentSampleLabel }
			</Alert>
			<ButtonGroup toggle>
				{
					radios.map((radio, index) => (
						<ToggleButton
							key={index}
							type="radio"
							variant="secondary"
							name="radio"
							value={radio.value}
							checked={radioValue === radio.value}
							onChange={(e) => handleChange(e.currentTarget.value)}
						>
							{radio.name}
						</ToggleButton>
					))
				}
			</ButtonGroup>
			<Form>
				<Form.Group controlId="formBasicRangeCustom">
					<Form.Label>Vol</Form.Label>
					<Form.Control 
						type="range" 
						value={rangeValue}
						onChange={(e) => {handleRange(e.currentTarget.value)}}
					/>
				</Form.Group>
			</Form>
		</>
	);
};
const INIT_VOLUME = 50;
const App = () => {
	const [currentSampleLabel, setCurrentSampleLabel] = React.useState('');
	const [currentBank, setCurrentBank] = React.useState(BANK_ONE);
	const [currentVolume, setVolume] = React.useState(INIT_VOLUME / 100);
	const handlerBankChange = (valueBank) => {
		setCurrentBank(valueBank);
	};
	const handleVolumeChange = (volume) => {
		setVolume(volume);
	};
	return(
		<Container >
			<h1>Drum Machine</h1>
			<Jumbotron >
				<Row>
					<Col>
						<DrumMachine  
							volume={currentVolume} 
							onPlay={(id) => {
								setCurrentSampleLabel(id);
							}}
							currentBank={banks[currentBank]}
						/>
					</Col>	
					<Col>
						<Controls 
							currentSampleLabel={currentSampleLabel || 'Sample'}
							onBankChange={handlerBankChange}
							onVolumeChange={handleVolumeChange}
						/>
					</Col>
				</Row>
			</Jumbotron>
		</Container>
	)
};
export default App;
