import React from 'react';
import { render } from '@testing-library/react';
import Splash from './Splash';

test('renders moto', () => {
    const { getByText } = render(<Splash />);
    setTimeout(function() {
        const moto = getByText(/Building Web Applications/i);
        expect(moto).toBeInTheDocument();
    }, 300);
});
