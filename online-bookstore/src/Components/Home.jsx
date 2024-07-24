import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";
import styles from '../styles/Home.module.css';

function Home() {
    const [genre, setGenre] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const [totalRecords, setTotalRecords] = useState(0); // to store total number of records

    const location = useLocation();
    const navigate = useNavigate();

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

        try {
            const response = await fetch(`http://localhost:5000/availablebooks?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setBooks(data.books);
            setTotalRecords(data.totalRecords);
        } catch (error) {
            console.error("Error in fetching books", error);
        }
    };

    useEffect(() => {
        fetchBooks(currentPage); // Fetch books when the component mounts or when location.search changes
    }, [location.search, currentPage]);

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
        <div className={styles.homeContainer}>
            <div className={styles.header}>
                <h1>Discover</h1>
                <FaShoppingCart className={styles.cartIcon} />
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
    );
}

export { Home };
