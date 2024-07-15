import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

function Login(){
    const [username, setusername]= useState('');
    const [password, setpassword]= useState('');

    const navigate =useNavigate();

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
                navigate('/home')
            }
        })
        .catch(error =>{
            console.error('There is problem in the fetch code ',error);
            //alert(error);
        });
    };
    
    return(
        <div>
            <div>
                <label>Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e)=>setusername(e.target.value)}
                  
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e)=> setpassword(e.target.value)}
                  
                />
            </div>
            <div>
                <button onClick={handleLogin}>
                    submit
                </button>
            </div>
        </div>
    );
}
 export {Login};