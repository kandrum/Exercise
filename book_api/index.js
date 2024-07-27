const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const client = require('./redis');
const {generateTocken, verifyTocken} =require('./towken');
const { promisify } = require('util');
//const { stringify } = require('querystring');
//const { access } = require('fs');
const app = express();

const getAsync =promisify(client.get).bind(client);
const setAsync =promisify(client.set).bind(client);
const delAsync =promisify(client.del).bind(client);

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
app.post('/login',async (req,res)=>{
    const {username,password}=req.body;// what is parsed as json from frontend 
    const sql ='select * from users where username= ?';//write the query 
    
    //Execute query from Mysql
    db.query(sql, [username], async(err,result)=>{
        if(err){
            res.status(500).json({error:'Error in query u have written'});
            return;
        }
        
        if(result.length>0){
           // console.log(result);
            const user =result[0];
            if(password === user.password){
                const accessToken =generateTocken({username:user.username},'5m');
                const refreshToken =generateTocken({username:user.username}, '7d');
                await setAsync(refreshToken, JSON.stringify({ username: user.username }));
                //const tocken =generateTocken({username:user.username});//create tocken
                res.status(200).json({message:'userfound',user: user.username,accessToken,refreshToken});//wrap message u send to client in tocken
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
            //console.log(result);
            res.status(200).json({message:'user added to database'})
        }else{
            res.status(500).json({message:'user failed to register'});
        }
    });
});
//====================================================================================
app.post('/token', async (req, res) => {
    const { refreshToken } = req.body;

    console.log('Received refresh token:', refreshToken);

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token required" });
    }

    const storedToken = await getAsync(refreshToken);
    if (!storedToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = verifyTocken(refreshToken);
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateTocken({ username: user.username }, '2m');
    const newRefreshToken = generateTocken({ username: user.username }, '5m');
    await setAsync(newRefreshToken, JSON.stringify({ username: user.username }));

    console.log('New tokens generated:', { accessToken: newAccessToken, refreshToken: newRefreshToken });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});


//================================================================================
/*app.get('/availablebooks',(req,res)=>{
    const {genre,searchTerm}=req.query;
    let sql ='select * from books where 1=1';
      if(genre){sql=sql+ ` AND genre = ${mysql.escape(genre)}`;} //` AND genre = ${mysql.escape(genre)}`
      if(searchTerm){sql=sql+` AND title LIKE ${mysql.escape('%'+ searchTerm + '%')}`;} // ` AND title LIKE ${mysql.escape('%' + searchTerm + '%')}`

    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({error:'Error in query u have written', details: err.message});
        }
        return res.json(result);
    });
}); */

app.get('/availablebooks', (req, res) => {
    const { genre, searchTerm, page = 1, limit } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM books WHERE 1=1';
    if (genre) sql += ` AND genre = ${mysql.escape(genre)}`;
    if (searchTerm) sql += ` AND title LIKE ${mysql.escape('%' + searchTerm + '%')}`;
    sql += ` LIMIT ${mysql.escape(parseInt(limit))} OFFSET ${mysql.escape(parseInt(offset))}`;

    let countSql = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
    if (genre) countSql += ` AND genre = ${mysql.escape(genre)}`;
    if (searchTerm) countSql += ` AND title LIKE ${mysql.escape('%' + searchTerm + '%')}`;

    db.query(countSql, (err, countResult) => {
        if (err) {
            return res.status(500).json({ error: 'Error in count query', details: err.message });
        }
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error in query', details: err.message });
            }
            res.json({ books: result, totalRecords: countResult[0].total });
        });
    });
});


 
//========================================================================================
app.get('/protected',(req,res)=>{
    const tocken =req.headers['authorization'];
    if(!tocken){
        return res.status(201).json({meaasge: 'No tocken'});
    }
    const decode = verifyTocken(tocken);
    if(!decode){
        return res.status(500).json({message: 'Failed to authenticate'});
    }
    res.status(200).json({message: 'Protected route setup',user:decode.username});
});
//===========================================================================================

//testing redis
 async function init(){
    const result =await client.get("message:2");
    console.log("result ->", result);
 };
 init();
 //==========================================================================================

app.get('/test', (req, res) => {
    res.send('Welcome to online_bookstore');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
