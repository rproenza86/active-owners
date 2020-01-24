import { useState } from 'react';

/**
 * Hook to control animation triggers.
 *
 * @param {number} delay Time in milliseconds to delay the animation
 */
export function useAnimation(
    delay: number = 100
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [animate, setAnimate] = useState(false);

    setTimeout(function() {
        setAnimate(true);
    }, delay);

    return [animate, setAnimate];
}

/**
 * Hook to handle the documents creations and updates.
 *
 * > NOTE: The CU stands for Create and Update
 */
export function useDocumentCU<T>(): [
    [T, React.Dispatch<React.SetStateAction<T>>],
    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
] {
    const [docInstance, setDocInstance] = useState({} as T);
    const [addOrEditDocument, setAddOrEditDocument] = useState(false);

    return [
        [docInstance, setDocInstance],
        [addOrEditDocument, setAddOrEditDocument]
    ];
}
