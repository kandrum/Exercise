const jwt = require("jsonwebtoken");
const secret = "Mou6pree2604$";

function generateTocken(user){
    return jwt.sign(user, secret, {expiresIn: '1hr'});
}
function verifyTocken(towken){
   try{
    return jwt.verify(towken,secret);
   }catch(err){
    return null;
   }
}

module.exports ={
    generateTocken,
    verifyTocken,
};