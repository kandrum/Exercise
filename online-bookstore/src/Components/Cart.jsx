import React, { useContext } from 'react';
import { cartArray } from './Contextapi';

const CartItems = () => {
    const { addToCart } = useContext(cartArray);

    return (
        <div>
            <h1>Cart Items</h1> {/* Add a heading to verify the component is rendering */}
            <ul>
                {addToCart.length === 0 && <li>No items in the cart</li>} {/* Handle empty cart */}
                {addToCart.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
};

export { CartItems };
