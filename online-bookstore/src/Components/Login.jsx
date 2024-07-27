import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import {FaUser, FaLock} from 'react-icons/fa';
import styles from '../styles/Login.module.css';
//import {useDispatch} from 'react-redux';
//import { verifysucess } from "../redux/slices/authenticate";

function Login(){
    const [username, setusername]= useState('');
    const [password, setpassword]= useState('');

    const navigate =useNavigate();
    //const dispatch =useDispatch();

    const handleLogin = (e)=>{
        e.preventDefault();//prevernt default submission

        fetch('http://localhost:5000/login',
            {
                method: 'POST',
                headers:{  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        )
        .then(response =>{
            if(!response.ok){
                return response.json().then(error =>{
                    //throw new Error(error.message);
                    alert(error.message);
                });
            }
            return response.json(); 
        }) 
        .then(data =>{
            console.log('Response from node',data)
            if(data.message === 'userfound'){
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                //localStorage.setItem('token', data.tocken); // Ensure 'tocken' is used consistently
                //dispatch(verifysucess());
                navigate('/home')
            }
        })
        .catch(error =>{
            console.error('There is problem in the fetch code ',error);
            //alert(error);
        });
    };
    
    return(
        <div className={styles.container}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Username:</label>
                <div className={styles.inputContainer}>
                    <FaUser className={styles.icon} />
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Password:</label>
                <div className={styles.inputContainer}>
                    <FaLock className={styles.icon} />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <button className={styles.button} onClick={handleLogin}>
                    Submit
                </button>
            </div>
        </div>
    );    
    
}
 export {Login};