import { useState } from 'react';

export function useAnimation(
    delay: number = 100
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [animate, setAnimate] = useState(false);

    setTimeout(function() {
        setAnimate(true);
    }, delay);

    return [animate, setAnimate];
}
