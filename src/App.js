import React, { useEffect, useRef } from "react";

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

const Pad = ({id, keyTrigger, currentKey, url, volume, onPlay }) => {
	const [isPlaying, setIsPlaying] = React.useState(false);
	const audioRef = useRef(null);
	React.useEffect(() => {
		audioRef.current.addEventListener('ended', (e) => {
			setIsPlaying(false);
		});
		/*const handlerKeyDown = (e) => {
			handlePlayAudio(e.key);
		};
		document.addEventListener('keydown', handlerKeyDown)
		return () => {
			document.removeEventListener('keydown', handlerKeyDown);
		};*/
	}, []);
	useEffect(() => {
		console.log('PAD currentKey' , currentKey)
		if(currentKey) {
			handlePlayAudio(currentKey);
		}
	}, [currentKey]);
	
	useEffect(() => {
		audioRef.current.volume = volume;
	}, [volume]);

	const handlePlayAudio = (key) => {
		console.log(key, keyTrigger)
		if(key && key.toUpperCase() === keyTrigger){
			playAudio();
		} else if (!key) {
			playAudio();
		}
	};
	const playAudio = () => {
		const audio = audioRef.current;
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
				ref={audioRef}
				src={url} 
				className="clip" 
				id={keyTrigger}
			></audio>
        </div>
    );
};

const DrumMachine = ({ volume, onPlay, currentBank, currentKey }) => {
    const banks = matrixSamples(currentBank);
    return (
        <div id="drum-machine">
            {banks.map((row, index) => (
                <Row key={index}>
                    {row.map(({ id, keyCode, keyTrigger, url }) => (
                        <Col xs="4" sm="4" md="3" key={id}>
                            <Pad
								id={id}
								currentKey={currentKey}
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
					<br/>
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
	const [currentKey, setCurrentKey] = React.useState(null);
	const handlerBankChange = (valueBank) => {
		setCurrentBank(valueBank);
	};
	const handleVolumeChange = (volume) => {
		setVolume(volume);
	};
	useEffect(() => {
		const handlerKeyDown = ({key}) => {
			console.log('key: ', key)
			setCurrentKey(key);
			setCurrentKey(null);
		};
		document.addEventListener('keydown', handlerKeyDown)
		return () => {
			document.removeEventListener('keydown', handlerKeyDown);
		};
	}, []);
	return(
		<Container style={{minWidth:300}}>
			<h1>Drum Machine</h1>
			<Jumbotron>
				<Row>
					<Col xs="12" sm="6" md="6" >
						<DrumMachine  
							volume={currentVolume} 
							currentKey={currentKey} 
							onPlay={(id) => {
								setCurrentSampleLabel(id);
							}}
							currentBank={banks[currentBank]}
						/>
					</Col>	
					<Col xs="12" sm="4" md="4" className="ml-2 pt-2">
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
