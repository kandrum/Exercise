const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse incoming requests with JSON payloads

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'newadmin', // Use the new username
    password: 'Mou6pree',
    database: 'online_bookstore' // Ensure this matches your database name
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error in connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database');
    connection.release(); // Release the connection back to the pool
});
//=========================================================================================
app.post('/login',(req,res)=>{
    const {username,password}=req.body;// what is parsed as json from frontend 
    const sql ='select * from users where username= ?';//write the query 
    
    //Execute query from Mysql
    db.query(sql, [username], (err,result)=>{
        if(err){
            res.status(500).json({error:'Error in query u have written'});
            return;
        }
        
        if(result.length>0){
           // console.log(result);
            const user =result[0];
            if(password === user.password){
                res.status(200).json({message:'userfound',user: user.username});
            }else{
                res.status(401).json({message:'Invalid Password'});
            }
            
        }else{
            res.status(404).json({message:'user not found'});
        }
    });

});
//============================================================================
app.post('/register',(req,res)=>{
    const {username,email,password}=req.body;
    const sql= 'insert into users (username,email,password) values (?,?,?)';

    //Execute query pool
    db.query(sql,[username,email,password],(err,result)=>{
        if(err){
            res.status(500).json({error: 'Error inquery u have written',userId: result.insertId});
        }
        if(result.affectedRows>0){
            console.log(result);
            res.status(200).json({message:'user added to database'})
        }else{
            res.status(500).json({message:'user failed to register'});
        }
    });
});
//================================================================================
app.get('/test', (req, res) => {
    res.send('Welcome to online_bookstore');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
