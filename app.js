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
};

// Fonction qui rafraichie un token pour un durée de un an
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
};

// notre route login
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
  const refreshToken = generateRefreshToken(user);
    res.send({
      accessToken,
      refreshToken,
    });
    console.log('accessToken user =>', accessToken);
    console.log('refreshToken user =>', refreshToken);

});

// notre route de rachaichisement du token
app.post('/api/refreshToken', (req, res)=>{
  // recuperation du token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer leToken'

    // si pas de token donc status 401 (non autoriser)
  if (!token) {
    return res.sendStatus(401);
  }

    // si token le verifier avec celui de l'utilisateur
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {

    if (err) {
      console.log("user token different => ", user);
      return res.sendStatus(401);
    }

    // TODO: Check en BDD que l'user est toujours existant/autorisé à utiliser la plateforme
    delete user.iat;
    delete user.exp;
    const refreshedToken = generateAccessToken(user);
    res.send({
      accessToken: refreshedToken,
    });
    
  });

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

  // si pas de token donc status 401 (non autoriser)
  if (!token) {
    return res.sendStatus(401);
  }

  // si token le verifier avec celui de l'utilisateur
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {

    // si le token est différent donc status 401 (non autoriser)
    if (err) {
      console.log("user token different => ", user);
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