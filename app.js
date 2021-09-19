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
// console.log(`hello this is my API`); 
//console.log(`secret is =>`, process.env.ACCESS_TOKEN_SECRET); 

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
//const accessToken = generateAccessToken(user);
// notre réponse
 //console.log('accessToken =>', accessToken);

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

  // déplacement de la fonction dans notre route et générer un token lord de la connection client
  const accessToken = generateAccessToken(user);
    res.send({
      accessToken
    });
    console.log('accessToken user =>', accessToken);

});




//* authentification des routes, voir si les routes avec jwt est correct.
// notre middleware d'authetification de token
function authenticateToken (req, res, next) {
  // recupération de l'autorisation depuis le header
  
  const authHeader = req.headers["authorization"];

  // on check si il n'est pas null et on recuppere la seconde valeur de la chaine de caractere
  // du client => header => "bearer  leToken"  <= Convention de nommage
  // on coupe la chaine en 2 au niveau de l'espace et on prend la valeur à l'indice 1
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer leToken'

  console.log(`req.headers =>`, req.headers)
  console.log('authHeader :>> ', authHeader[1]);
  console.log('token => ',token);

  // si pas de token donc status 401 (non autoriser)
  if (!token) {
    return res.sendStatus(401);
  }
  console.log("pas de token => ", token);

  // si token le verifier avec celui de l'utilisateur
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {

    // si le token est différent donc status 401 (non autoriser)
    if (err) {
      console.log("user token diferent => ", user);
      return res.sendStatus(401);
    }

    console.log("user = user => ", user);
    // si les tokens son identique et on recupere les infos de l'utilisateur pour chacune de nos routes
    req.user = user;
    next(); // pour passer au suivant.
  });

};

// création de la route et on lui passe le middleware
app.get ('/api/me', authenticateToken, (req, res) => {
  console.log(req.user);
  // puis on retourne le user
  res.send(req.user);
});



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}!`));