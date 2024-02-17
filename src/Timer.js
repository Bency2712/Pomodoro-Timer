import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import { useContext,useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';

const red = "#f54e4e";
const green = "#4aec8c";
function Timer(){
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(false);
    const [mode,setMode] = useState('work');
    const [secondsLeft,setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick(){
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }
    



    useEffect(() => {
        function switchMode(){
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode==='work'? settingsInfo.workMinutes: settingsInfo.breakMinutes)*60;
            
            setMode(nextMode);
            modeRef.current=nextMode;
    
            setSecondsLeft(nextSeconds);
            secondsLeftRef.current=nextSeconds;
        }

        /*Calculating the time left */
        secondsLeftRef.current=settingsInfo.workMinutes*60;
        setSecondsLeft(secondsLeftRef.current);
    

      

        /*Using state variables in intervals won't work and will have the same variable as in the beginning
        , hence we will add references useRef */
        const interval =setInterval(() => {

            /*If it is paused, we don't do anything. */
            if(isPausedRef.current){
                return;
            }
           /* If it is running then we check if it is 0, if yes then we switch mode (work to break or break to work) */
            if (secondsLeftRef.current === 0){
                return switchMode();
            }

            //otherwise we take one second from seconds left
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [settingsInfo]);

    const totalSeconds = mode === 'work' ? settingsInfo.workMinutes*60 : settingsInfo.breakMinutes*60;

    const percentage = Math.round(secondsLeft/totalSeconds*100);

    const minutes =Math.floor(secondsLeft/60); /*It should only show the number without the decimal */
    let seconds = secondsLeft%60;
    if (seconds<10) seconds='0'+seconds;

    return(
        <div>
            <CircularProgressbar 
            value={percentage} 
            text={minutes + ':' + seconds} 
            styles={buildStyles({
            textColor: '#fff',
            pathColor:mode ==='work'? red : green,
            trailColor: 'rgba(255,255,255,.2)',
            })}/>
            <div style={{marginTop: '20px'}}>


                {/*If it is paused, you will see the play button, otherwise you will see the pause buttton */}
                {isPaused
                ?<PlayButton onClick = {()=>{setIsPaused(false); isPausedRef.current = false;}}/> 
                : <PauseButton onClick = {()=>{setIsPaused(true); isPausedRef.current = true;}}/> }
            </div>
            <div style={{marginTop: '20px'}}>
                <SettingsButton onClick={() => {settingsInfo.setShowSettings(true)}}/>
            </div>
        </div>

        
    )
}

export default Timer;