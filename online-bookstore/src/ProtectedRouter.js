import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Ensure 'token' is used consistently
        console.log('Token retrieved:', token);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                
                const currentTime = Date.now() / 1000; // current time in seconds

                if (decoded.exp < currentTime) {
                    // Token has expired
                    localStorage.removeItem('token');
                    setIsTokenValid(false);
                    navigate('/');
                } else {
                    // Token is valid
                    setIsTokenValid(true);
                }
            } catch (error) {
                // Token is invalid
                localStorage.removeItem('token');
                setIsTokenValid(false);
                navigate('/');
            }
        } else {
            // No token found
            setIsTokenValid(false);
            navigate('/');
        }
    }, [navigate]);

    return isTokenValid ? children : null;
};

export default ProtectedRoute;





/*import { useSelector } from 'react-redux';




const ProtectedRoute = ({ children }) => { // /home would be the child component here 
    const navigate =useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(()=>{
        if (!isAuthenticated) {
            navigate('/');
        }

    });

    return children;
};*/