// Utilisation de la lilbrairie JWT
const jwt = require(`jsonwebtoken`);
// chargement du fichier .env
require(`dotenv`).config();

// nos testes
console.log(`hello this is my API`);
console.log(`secret is =>`, process.env.ACCESS_TOKEN_SECRET);

// utilisateur fictive
const user = {
    id: 42,
    name: 'Jean Bon',
    email: 'jeanbon@gmail.com',
    admin: true,
};

// Fonction qui génére un token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

// Fonction qui génére un token pour un temps defini de 1800S = 30mn
const accessToken = generateAccessToken(user);
// notre réponse
console.log('accessToken =>', accessToken);