import React, { useContext, useEffect, useState} from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem, Select, InputLabel, FormControl, Button, useColorScheme } from "@mui/material";
import styles from '../styles/Home.module.css';
import { cartArray } from "./Contextapi";

function Home() {
    const [genre, setGenre] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const [totalRecords, setTotalRecords] = useState(0); // to store total number of records
    //const [addToCart, setaddToCart] = useState([]);
    
    const { addToCart, setaddToCart } = useContext(cartArray);

    const location = useLocation();
    const navigate =useNavigate();
    //const {addToCart} =useContext(cartArray);
    
    
    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on search
        fetchBooks(1); // Fetch books for the first page
    };

    const fetchBooks = async (page) => {
        const params = new URLSearchParams();
        if (genre) params.append('genre', genre);
        if (searchTerm) params.append('searchTerm', searchTerm);
        params.append('page', page);
        params.append('limit', recordsPerPage);
    
        const accessToken = localStorage.getItem('accessToken');
    
        try {
            const response = await fetch(`http://localhost:5000/availablebooks?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    // Access token might be expired, try to refresh it
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        // Retry the fetch with the new access token
                        const retryResponse = await fetch(`http://localhost:5000/availablebooks?${params.toString()}`, {
                            headers: {
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        });
                        if (!retryResponse.ok) {
                            throw new Error('Network response was not ok on retry');
                        }
                        const retryData = await retryResponse.json();
                        setBooks(retryData.books);
                        setTotalRecords(retryData.totalRecords);
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } else {
                const data = await response.json();
                setBooks(data.books);
                setTotalRecords(data.totalRecords);
            }
        } catch (error) {
            console.error("Error in fetching books", error);
        }
    };
    
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
    
        if (!refreshToken) {
            console.error('No refresh token found');
            return null;
        }
    
        try {
            const response = await fetch('http://localhost:5000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            return data.accessToken;
        } catch (error) {
            console.error('Error refreshing token', error);
            return null;
        }
    };
    const toCart =(book) =>{
        setaddToCart((prevCart) => {     
            if(prevCart.some(cartBook => cartBook.id === book.id)){
                return prevCart.filter(cartBook =>cartBook.id !== book.id)
            }else{
                return [...prevCart, book];
            }
        });
       
    };
    console.log(addToCart); 

    const goToCart = ()=>{
        navigate('/cart');
    }

    useEffect(() => {
        fetchBooks(currentPage); // Fetch books when the component mounts or when location.search , or currentPage
    }, [location.search, currentPage]);

    //console.log(location.search);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('addToCart')) || [];
        setaddToCart(storedCart);
    }, []);
    
    useEffect(() => {
        localStorage.setItem('addToCart', JSON.stringify(addToCart));
    }, [addToCart]);
    

    const totalPages = Math.ceil(totalRecords / recordsPerPage); // Calculate total pages

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    return (
        //<cartArray.Provider value={{ addToCart, setaddToCart }}>
            <div className={styles.homeContainer}>
                <div className={styles.header}>
                    <h1>Discover</h1>
                    <FaShoppingCart className={styles.cartIcon} onClick={goToCart}/>
                    <span className={styles.cartCount}>{addToCart.length}</span>
                </div>
                <div className={styles.searchContainer}>
                    <FormControl variant="outlined" className={styles.formControl}>           
                        <InputLabel id="genre-label">Genre</InputLabel>
                        <Select
                            labelId="genre-label"
                            id="genre-select"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            label="Genre"
                            className={styles.selectOutlined}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value="fiction">Fiction</MenuItem>
                            <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                            <MenuItem value="fantasy">Fantasy</MenuItem>
                            <MenuItem value="mystery">Mystery</MenuItem>
                            <MenuItem value="romance">Romance</MenuItem>
                            <MenuItem value="sci-fi">Sci-Fi</MenuItem>
                        </Select>
                    </FormControl>
                    <input
                        type="text"
                        placeholder="Search by book name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>
                        Search
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.booksTable}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Publication Date</th>
                                <th>Price</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{new Date(book.publication_date).toLocaleDateString()}</td>
                                    <td>${book.price.toFixed(2)}</td>
                                    <td>
                                        <label>
                                          <input type="checkbox"
                                          checked ={addToCart.some(cartBook => cartBook.id === book.id)} 
                                          onChange={() => toCart(book)}/>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav>
                        <ul className={styles.pagination}>
                            <li className={styles.pageItem}>
                                <a href='#' className={styles.pageLink} onClick={prevPage}>
                                    prev
                                </a>
                            </li>
                            {[...Array(totalPages).keys()].map(n => (
                                <li key={n} className={`${styles.pageItem} ${currentPage === n + 1 ? styles.active : ''}`}>
                                    <a href='#' className={styles.pageLink} onClick={() => changeCurrentPage(n + 1)}>
                                        {n + 1}
                                    </a>
                                </li>
                            ))}
                            <li className={styles.pageItem}>
                                <a href='#' className={styles.pageLink} onClick={nextPage}>
                                    next
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        //</cartArray.Provider>
    );
}

export { Home };
