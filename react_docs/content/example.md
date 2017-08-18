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
