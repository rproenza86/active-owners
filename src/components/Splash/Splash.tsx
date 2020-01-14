import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import logo from './logo.svg';
import './Splash.css';

const Splash: React.FC = () => {
    const [activateLogoTransition, setActivateLogoTransition] = useState(false);
    const [activateMotoTransition, setActivateMotoTransition] = useState(false);
    const [moto, setMoto] = useState('');

    const TransitionTimeout = 99999999;

    setTimeout(function() {
        setActivateLogoTransition(true);
    }, 100);

    setTimeout(function() {
        setMoto('Building Impeccable Web Applications');
        setActivateMotoTransition(true);
    }, 200);

    return (
        <header className="Splash-header">
            <CSSTransition
                in={activateLogoTransition}
                timeout={TransitionTimeout}
                classNames="Splash-logo-container"
            >
                <img src={logo} className="Splash-logo" alt="logo" />
            </CSSTransition>

            <CSSTransition
                in={activateMotoTransition}
                timeout={TransitionTimeout}
                classNames="Splash-moto"
            >
                <div>
                    <p>{moto}</p>
                </div>
            </CSSTransition>
        </header>
    );
};

export default Splash;
