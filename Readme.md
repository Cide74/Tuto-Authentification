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

## 5 Creation d'un utilisateur pour le teste

```js
const user = {
    id: 42,
    name: 'Jean Bon',
    email: 'jeanbon@gmail.com',
    admin: true,
};
```

création d'une fonction pour générer un TOKEN pour un user

```js
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}
```
puis génération d'un TOKEN 

```js
const accessToken = generateAccessToken(user);
console.log('accessToken =>', accessToken);
```

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