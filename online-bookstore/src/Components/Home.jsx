import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MenuItem, Select, InputLabel, FormControl, TextField, Button } from "@mui/material";
import styles from '../styles/Home.module.css';

function Home() {
    const [genre, setGenre] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        // Implement your search logic here
        console.log(`Searching for ${searchTerm} in genre ${genre}`);
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
                        onChange={handleGenreChange}
                        label="Genre"
                    >
                        <MenuItem value="">
                            <em>None</em>
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
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <button onClick={handleSearch} className={styles.searchButton}>
                    Search
                </button>
            </div>
        </div>
    );
}

export { Home };
