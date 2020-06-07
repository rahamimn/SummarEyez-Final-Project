import React, {useState, useEffect} from 'react';

export const Timer = ({seconds,whenFinished}) => {
    const [secondPassed, setSecondPassed] = useState(seconds);

    useEffect(() => {
        setTimeout(() => {

            if (0 === (secondPassed-1) ){
                setSecondPassed(0);
                whenFinished();
            }
            else{
                setSecondPassed(secondPassed-1);
            }
            
        }, 1000);
    });

    const mins = Math.floor(secondPassed/60);
    const secs = Math.floor(secondPassed%60);

    const minsText = mins < 10  ? '0'+mins: mins; 
    const secsText = secs < 10  ? '0'+secs: secs; 
    
    return <div style={{fontSize:'xx-small'}}> 
        {minsText}:{secsText}
    </div>
} 