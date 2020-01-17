import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test.skip('renders moto', () => {
    const { getByText } = render(<App />);
    setTimeout(function() {
        const moto = getByText(/Building Web Applications/i);
        expect(moto).toBeInTheDocument();
    }, 300);
});
