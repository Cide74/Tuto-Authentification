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