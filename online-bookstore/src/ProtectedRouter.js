import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);

    const refreshAccessToken = async (refreshToken) => {
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
            console.error('Error refreshing access token:', error);
            return null;
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // current time in seconds

                    if (decoded.exp < currentTime) {
                        // Token has expired, try to refresh it
                        const newAccessToken = await refreshAccessToken(refreshToken);
                        if (newAccessToken) {
                            setIsTokenValid(true);
                        } else {
                            setIsTokenValid(false);
                            navigate('/');
                        }
                    } else {
                        // Token is valid
                        setIsTokenValid(true);
                    }
                } catch (error) {
                    // Token is invalid
                    localStorage.removeItem('accessToken');
                    setIsTokenValid(false);
                    navigate('/');
                }
            } else {
                // No token found
                setIsTokenValid(false);
                navigate('/');
            }
        };

        checkToken();
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