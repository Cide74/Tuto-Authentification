# Suivi du tuto JWT + Refresh

https://www.wawasensei.dev/tuto/tuto-authentification-refresh-json-web-token-en-nodejs-avec-express

## 1 initialisation du projet

Pour initialiser le projet et dire oui a tous

```shell
npm init -y
```

## 2 installation des dependences

```shell
npm i express dotenv jsonwebtoken
```

pour plus d'information

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken),
- [dotenv](https://www.npmjs.com/package/dotenv),
- [express](https://www.npmjs.com/package/express)

## 3 test de l'api

pour tester notre application dans `root/app.js`
on fait un simple console.log

```js
console.log('hello this is my API');
```

puis on peu faire dans le terminal

```shell
node server
```

## 4 Génération du Token

### 4.1 utilisation de la librairie "JSONWebToken"

Dans `root/app.js` on ajoute

```js
const jwt = require('jsonwebtoken'); 

//console.log('hello this is my API');
```

### 4.2 utilisation de la librairie "dotenv"

création d'un fichier `.env` dans `root/.env` et `root/.env.example`

dans `.env` on met la clée secrète

```s
ACCESS_TOKEN_SECRET=4242XX424208
REFRESH_TOKEN_SECRET=424200000X1
```

et dans `.env.example` c'est pour indiquer quelles sont les information demander dans `.env`.

```s
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

puis dans `root/app.js`

```js
// const jwt = require(`jsonwebtoken`);
   require(`dotenv`).config(); 

// console.log(`hello this is my API`);
```

soit le fichier final `app.js`

```js
const jwt = require(`jsonwebtoken`);
require(`dotenv`).config();

console.log(`hello this is my API`);
```

après on appel la clés secret pour êtres sur que la transmision de donné fonctionne entre `app.js` et `.env`

```js
console.log(`secret is =>`, process.env.ACCESS_TOKEN_SECRET);
```
Soit le rendu final du fichier `app.js`

```js
const jwt = require(`jsonwebtoken`);
require(`dotenv`).config();

console.log(`hello this is my API`);
console.log(`secret is =>`, process.env.ACCESS_TOKEN_SECRET);
```

## 5 Création d'un utilisateur pour le teste et génération d'un token temporaire

maintenant nous allons créer un utilisateur et une fonction qui vas génére un token avec la clée secrète pour un temps donné (ne pas mettre un temps tros long sinon plus besion de se connecter)

### 5.1 création d'un utilisateur

```js
const user = {
    id: 42,
    name: 'Jean Bon',
    email: 'jeanbon@gmail.com',
    admin: true,
};
```

### 5.2 création d'une fonction pour générer un TOKEN pour un utilisateur

```js
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}
```

### 5.3 Génération d'un TOKEN

```js
const accessToken = generateAccessToken(user);
console.log('accessToken =>', accessToken);
```

### 5.1 Rendu final

soit le fichier `app.js` après modification

```js
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

// Fonction qui génére un token pour un temps defini de 1800S = 30mn
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

// vars qui génére un token
const accessToken = generateAccessToken(user);
// notre réponse
console.log('accessToken =>', accessToken);
```

le resultat dans le terminal

```shell
hello this is my API
secret is => 4242XX424208
accessToken => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMxOTk2NDU0LCJleHAiOjE2MzE5OTgyNTR9.kkG3BGsDeUbcX3Qa9db29aOZoYMhgB7jGL0byMUAcb8  
```

## 6 Création des routes avec express

Création du router avec express via les url

### 6.1 appel de express

```js
// utilisation de la lib express pour la création de notre router
const express = require(`express`);
const app = express();
// transmision de donnée en JSON
app.use(express.json());
// lecture des url pour encoder les donnée
app.use(express.urlencoded({ extended: true}));
```

notre fichier final `app.js`

```js
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
const accessToken = generateAccessToken(user);
// notre réponse
console.log('accessToken =>', accessToken);
```

### 6.2 Création de nos routes

création de nos route login et test du mdp + deplacement de notre fonction de génération de token

```js
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
```

puis on vas lancer notre serveur sur un port spécifique

dans `.env` et `.env.example` on ajoute le PORT

```s
PORT=3000
```

puis son utilisation

```js
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}!`));
```

Soit le rendu final du fichier `app.js`

```js
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

```

## 6.3 Teste de nos routes 

### avec "Thunder Client"

```http
POST localhost:3000/api/login
```

et dans body

```json
{
    "email": "jeanbon@gmail.com",
    "password": "cuillere"
}
```
la réponse en JSON 

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMxOTk5MjQ4LCJleHAiOjE2MzIwMDEwNDh9.uVp84Pz8yfEG44go2YJoMzf463ISKUehKwZXH4MrX4Y"
}
```

et voila on à notre JWT

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMxOTk5MjQ4LCJleHAiOjE2MzIwMDEwNDh9.uVp84Pz8yfEG44go2YJoMzf463ISKUehKwZXH4MrX4Y"
}
```

### avec REST client

création d'un fichier test.http a la racine de notre app soit `root/test.http`

```http

### //api/login =>ok
POST http://localhost:3000/api/login
Content-Type: application/json

{
    "email": "jeanbon@gmail.com",
    "password": "cuillere"
}
```

voici la réponce attendu en JSON avec le status 200

```json
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 235
ETag: W/"eb-BT5emBsL0ptJlqp1ZzdfxD3/XAE"
Date: Sat, 18 Sep 2021 21:12:56 GMT
Connection: close

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMxOTk5NTc2LCJleHAiOjE2MzIwMDEzNzZ9.1c3NLe3h42nwbGqGJlByh-NiVKXKjVYbJSByCfATlMY"
}
```

Si pas de corespondance il y a  une erreur 401

## Authorization & Authentification d'appels API

création de route authentifier
création d'un middelware

```js

// notre middleware d'authetification de token
function authenticateToken (req, res, next) {
  const authHeader = req.headers[`authorisation`];
  const token = authHeader && authHeader.split(' ') [1]; // 'Bearer leToken'

  // si pas de token donc status 401 (non autoriser)
  if (!token) {
    return res.sendStatus(401);
  }

  // si token le verifier avec celui de l'utilisateur
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {

    // si le token est différent donc status 401 (non autoriser)
    if (err) {
      return res.sendStatus(401);
    }

    // si les tokens son identique et on recupere les infos de l'utilisateur pour chacune de nos routes
    req.user = user;
    next();
  });

};
```

création de la route

```js
// création de la route et on lui passe le middleware
app.get ('/api/me', authenticateToken,(req,res) => {
  // puis on retourne le user
  res.send(req.user)
});
```

teste de notre middleware
dans thunder client

pour le momment pas de retour

```js

```

### Test avec PostMan

Avec Postman 

**envoi des données**

![postman1](img\postman1.png)

nous avons la route puis les data dans le body et nous avon la reponse (le token valide)

**Retour des données**

![postman2](img\postman2.png)

on copie le token et on le colle dans le volet Auth et types Bearer Token et on a la bonne réponse avec une date de création et une fin
### Test avec Client REST

dans le fichier test.http

```s
### //api/login =>ok
POST http://localhost:3000/api/login
Content-Type: application/json

{
    "email": "jeanbon@gmail.com",
    "password": "cuillere"
}
```

sa réponse

```s
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 235
ETag: W/"eb-5whwZrhBaycOKM1TEGd5J/V3aXY"
Date: Sun, 19 Sep 2021 10:17:25 GMT
Connection: close

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMyMDQ2NjQ1LCJleHAiOjE2MzIwNDg0NDV9.JYMLHS9rN5Whn_yODPTr4M0q4SYQFMuMcyypjHXWlXM"
}
```

on copie le token dans le GET

```js
### /api/me => ok
GET http://localhost:3000/api/me
Content-Type: application/json
Authorization:barer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKZWFuIEJvbiIsImVtYWlsIjoiamVhbmJvbkBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMyMDQ2NjQ1LCJleHAiOjE2MzIwNDg0NDV9.JYMLHS9rN5Whn_yODPTr4M0q4SYQFMuMcyypjHXWlXM

```

La reponse

```js
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 102
ETag: W/"66-xuaDpmX11Xh7cVTOdrlv743YwSQ"
Date: Sun, 19 Sep 2021 10:23:08 GMT
Connection: close

{
  "id": 42,
  "name": "Jean Bon",
  "email": "jeanbon@gmail.com",
  "admin": true,
  "iat": 1632046645,
  "exp": 1632048445
}
```

Le rendu final du ficher `root/app.js`

```js
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
```

## Le Refresh Token

cela permet de rafrechire un Token si l'utilisateur est connecter mais aussi de controler si un user est supprimer ou banni

clone de notre fonction 

```js
// Fonction qui génére un token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}
```

pour la renomer et lui donner sa clée de refresh

```js

// Fonction qui génére un token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
};

// Fonction qui rafraichie un token pour une durée de un an
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
};
```

Création de la route pour rafraichire le token

```js
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
```

on passe l'information du refreshToken en meme temps que accessToken dans notre route de login

```js
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
    res.send({
      accessToken,
      refreshToken,
    });
    console.log('accessToken user =>', accessToken);
    console.log('refreshToken user =>', refreshToken);

```

Rendu final de app.js

```js
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
```

Teste dans postman on doit recevoir un accessToken + un refreshTokken

![postman3](img\postman3.png)

on peut faire ausi avec le test.http aussi

## Utilisation côté client avec Axios

nous pouvons l'utiliser avec Vue Réact et RéactNative

ici utilisation d'un fake pour le test et aider a la comprenssion

installation de la dependence de Axios en dev

```shell
npm i --save-dev axios
```
création d'un fichier `root/fake-client.js`

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```

```js
```
v