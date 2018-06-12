### Obtener token de autenticación

Iniciar sesión para obtener un token

```endpoint
POST /v1/auth/login
```

#### request de ejemplo.


Propiedad | Descripción
---|---
`username` | Nombre de usuario único
`password` | Contraseña

```curl
curl -X POST \
  http://api.gobhash.com/v1/auth/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"username": "test",
	"password": "1234",
}'
```

```javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://api.gobhhash.com/v1/auth/login",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n\t\"username\": \"test\",\n\t\"password\": \"1234\"}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
```

```python
import requests

url = "http://api.gobhash.com/v1/auth/login"

payload = "{\"username\": \"test\",\"password\": \"1234\"}"
headers = {
    'content-type': "application/json",
    'cache-control': "no-cache"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)
```
```nodejs
var request = require("request");

var options = { method: 'POST',
  url: 'http://api.gobhash.com/v1/auth/login',
  headers: 
   { 
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { username: 'test',
     password: '1234' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

#### Respuesta de ejemplo

```json
{
    "token": "ABCD",
    "username": "test",
    "id": "1234"
}
```
### Feed en Tiempo Real con WebSockets (Solo JS)

1. Se conecta al servidor.


* El hosting actual no permite long polling por lo que hay que especificarle explicítamente web sockets como protocolo.

<br/>
<br/>
<br/>

```javascript
var url = 'https://api.gobhash.com'; // api url
var socket = io(url,
  {
  transports: ['websocket']
  }
);
```

<br/>


2. Autenticarse 

* El servidor necesita del token JWT para verificar la autenticidad de la conexión.

* Si el token es inválido el servidor desconectará automáticamente al cliente.


```javascript

socket.emit('authenticate', {
  token: 'Token JWT'
});
```
<br/>


* Si el token es válido se emitirá una señal en el canal de `authenticated` y el cliente lo puede recibir así. Y se guardará al usuario en un estado de online.

```javascript
socket.on('authenticated', function(data) {
  console.log(data.auth); // true or false
});
```

<br/>



3. Feed

* Una vez autenticado, a los clientes online puedne escuchar a post en tiempo real en el siguiente evento.

```javascript
socket.on('update_feed', function(data) {
  //donde data es el post definido en el modelo Post.
});
```




