// ici on simule le front

const axios = require('axios');

// Base des requêtes
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

console.log('trying to login');

// stokage de refreshToken
let refresheToken;

// ma route login avec les identifiants de connection
instance.post('/login', { 
  email: 'jeanbon@gmail.com',
  password: 'cuillere',
}).then((response) => {
  console.log('auth success');

  // intégration du token dans le headers du client
  instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
  refresheToken = response.data.refreshToken;
  loadUserInfos();
}).catch((error) => {
  console.log(err.response.status);
});

function loadUserInfos() {
  console.log("load User Info");
  instance.get('/me').then((response) => {
    console.log("response data => ", res);
  }).catch((error) => {
      console.log("erreur de réccupération du token", error);
      console.log("status ", error.response.status);
  });
};
