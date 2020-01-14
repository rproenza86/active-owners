import React, { useState } from 'react';

import Splash from '../Splash/Splash';
import Main from '../layout/Main/Main.layout';
import ActiveOwner from '../ActiveOwner/ActiveOwner';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(function() {
        setIsLoading(false);
    }, 1000);

    return (
        <div className="App">
            {isLoading ? (
                <Splash />
            ) : (
                <Main>
                    <ActiveOwner />
                </Main>
            )}
        </div>
    );
};

export default App;
