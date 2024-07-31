import React, { useContext, useState,useEffect } from 'react';
import { cartArray } from './Contextapi';
import styles from '../styles/Cart.module.css';

const CartItems = () => {
    const { addToCart } = useContext(cartArray);
    const [sum, setsum]=useState(0);
    
    useEffect(()=>{
        const total = addToCart. reduce((acc,book)=>acc+book.price ,0);
        setsum(total);
    })
    return (
        <div>
            <h1>Cart Items</h1> {/* Add a heading to verify the component is rendering */}
            <ul>{addToCart.length === 0 && <li>No items in the cart</li>} </ul>{/* Handle empty cart */}  
            <div className={styles.tableContainer}>
            <table className={styles.booksTable} >
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Publication Date</th>
                                <th>Price</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {addToCart.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{new Date(book.publication_date).toLocaleDateString()}</td>
                                    <td>${book.price.toFixed(2)}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
            <div>
                <h1>Total : ${sum}</h1>
            </div>
            
        </div>
    );
};

export { CartItems };
