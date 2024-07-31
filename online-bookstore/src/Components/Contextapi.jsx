import React, { createContext, useState } from 'react';

// Create the context
export const cartArray = createContext();

export const CartProvider = ({ children }) => {
    const [addToCart, setaddToCart] = useState([]);

    return (
        <cartArray.Provider value={{ addToCart, setaddToCart }}>
            {children}
        </cartArray.Provider>
    );
};
