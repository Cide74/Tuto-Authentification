const jwt = require('jsonwebtoken')

// chargement du fichier d'env
require('dotenv').config();
// accès au variables
process.env.ACCESS_TOKEN_SECRET;

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

const user = {
    id: 42,
    name: 'Jean Bon',
    email: 'jeanbon@gmail.com',
    admin: true,
};

const accessToken = generateAccessToken(user);
console.log('accessToken', accessToken);