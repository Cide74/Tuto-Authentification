// Utilisation de la lilbrairie JWT
const jwt = require(`jsonwebtoken`);
// chargement du fichier .env
require(`dotenv`).config();

// utilisation de la lib express pour la création de notre router
const express = require(`express`);
const app = express();
// transmision de donnée en JSON
app.use(express.json());
// lecture des url pour encoder les donnée
app.use(express.urlencoded({ extended: true}));

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
// const accessToken = generateAccessToken(user);
// notre réponse
// console.log('accessToken =>', accessToken);

app.post('/api/login', (req, res) => {

    // TODO: fetch le user depuis la db basé sur l'email passé en paramètre
    if (req.body.email !== 'jeanbon@gmail.com') {
        res.status(401).send('invalid credentials');
        return ;
    }
    // TODO: check que le mot de passe du user est correct
    if (req.body.password !== 'cuillere') {
        res.status(401).send('invalid credentials');
        return ;
    }

  // déplacement de la fonction dans notre route
  const accessToken = generateAccessToken(user);
  res.send({
        accessToken,
    });

});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}!`));