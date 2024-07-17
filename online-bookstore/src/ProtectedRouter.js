import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';




const ProtectedRoute = ({ children }) => { // /home would be the child component here 
    const navigate =useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(()=>{
        if (!isAuthenticated) {
            navigate('/');
        }

    });

    return children;
};

export default ProtectedRoute;
