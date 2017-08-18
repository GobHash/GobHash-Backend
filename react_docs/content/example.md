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

### Create wobble

Creates a new, empty wobble.

```endpoint
POST /wobbles/v1/{username}
```

#### Example request

```curl
curl -X POST https://wobble.biz/wobbles/v1/{username}
```

```bash
$ wbl wobbles create
```

```javascript
client.createWobble({
  name: 'example',
  description: 'An example wobble'
}, function(err, wobble) {
  console.log(wobble);
});
```

```python
response = wobbles.create(
  name='example', description='An example wobble')
```

#### Example request body

```json
{
  "name": "foo",
  "description": "bar"
}
```

Property | Description
---|---
`name` | (optional) the name of the wobble
`description` | (optional) a description of the wobble

#### Example response

```json
{
  "owner": "{username}",
  "id": "{wobble_id}",
  "name": null,
  "description": null,
  "created": "{timestamp}",
  "modified": "{timestamp}"
}
```

### Retrieve a wobble

Returns a single wobble.

```endpoint
GET /wobbles/v1/{username}/{wobble_id}
```

Retrieve information about an existing wobble.

#### Example request

```curl
curl https://wobble.biz/wobbles/v1/{username}/{wobble_id}
```

```bash
$ wbl wobble read-wobble wobble-id
```

```python
attrs = wobbles.read_wobble(wobble_id).json()
```

```javascript
client.readWobble('wobble-id',
  function(err, wobble) {
    console.log(wobble);
  });
```

#### Example response

```json
{
  "owner": "{username}",
  "id": "{wobble_id}",
  "created": "{timestamp}",
  "modified": "{timestamp}"
}
```

### Update a wobble

Updates the properties of a particular wobble.

```endpoint
PATCH /wobbles/v1/{username}/{wobble_id}
```

#### Example request

```curl
curl --request PATCH https://wobble.biz/wobbles/v1/{username}/{wobble_id} \
  -d @data.json
```

```python
resp = wobbles.update_wobble(
  wobble_id,
  name='updated example',
  description='An updated example wobble'
  ).json()
```

```bash
$ wbl wobble update-wobble wobble-id
```

```javascript
var options = { name: 'foo' };
client.updateWobble('wobble-id', options, function(err, wobble) {
  console.log(wobble);
});
```

#### Example request body

```json
{
  "name": "foo",
  "description": "bar"
}
```

Property | Description
---|---
`name` | (optional) the name of the wobble
`description` | (optional) a description of the wobble

#### Example response

```json
{
  "owner": "{username}",
  "id": "{wobble_id}",
  "name": "foo",
  "description": "bar",
  "created": "{timestamp}",
  "modified": "{timestamp}"
}
```

### Delete a wobble

Deletes a wobble, including all wibbles it contains.

```endpoint
DELETE /wobbles/v1/{username}/{wobble_id}
```

#### Example request

```curl
curl -X DELETE https://wobble.biz/wobbles/v1/{username}/{wobble_id}
```

```bash
$ wbl wobble delete-wobble wobble-id
```

```python
resp = wobbles.delete_wobble(wobble_id)
```

```javascript
client.deleteWobble('wobble-id', function(err) {
  if (!err) console.log('deleted!');
});
```

#### Example response

> HTTP 204

### List wibbles

List all the wibbles in a wobble. The response body will be a
WobbleCollection.

```endpoint
GET /wobbles/v1/{username}/{wobble_id}/wibbles
```

#### Example request

```curl
curl https://wobble.biz/wobbles/v1/{username}/{wobble_id}/wibbles
```

```bash
$ wbl wobble list-wibbles wobble-id
```

```python
collection = wobbles.list_wibbles(wobble_id).json()
```

```javascript
client.listWobbles('wobble-id', {}, function(err, collection) {
  console.log(collection);
});
```

#### Example response

```json
{
  "type": "Wobble",
  "wibbles": [
    {
      "id": "{wibble_id}",
      "type": "Wobble",
      "properties": {
        "prop0": "value0"
      }
    },
    {
      "id": "{wibble_id}",
      "type": "Wobble",
      "properties": {
        "prop0": "value0"
      }
    }
  ]
}
```

### Insert or update a wibble

Inserts or updates a wibble in a wobble. If there's already a wibble
with the given ID in the wobble, it will be replaced. If there isn't
a wibble with that ID, a new wibble is created.

```endpoint
PUT /wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id}
```

#### Example request

```curl
curl https://wobble.biz/wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id} \
  -X PUT \
  -d @file.geojson
```

```bash
$ wbl wobble put-wibble wobble-id wibble-id 'geojson-wibble'
```

```javascript
var wibble = {
  "type": "Wobble",
  "properties": { "name": "Null Island" }
};
client.insertWobble(wibble, 'wobble-id', function(err, wibble) {
  console.log(wibble);
});
```

#### Example request body

```json
{
  "id": "{wibble_id}",
  "type": "Wobble",
  "properties": {
    "prop0": "value0"
  }
}
```

Property | Description
--- | ---
`id` | the id of an existing wibble in the wobble

#### Example response

```json
{
  "id": "{wibble_id}",
  "type": "Wobble",
  "properties": {
    "prop0": "value0"
  }
}
```

### Retrieve a wibble

Retrieves a wibble in a wobble.

```endpoint
GET /wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id}
```

#### Example request

```curl
curl https://wobble.biz/wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id}
```

```bash
$ wbl wobble read-wibble wobble-id wibble-id
```

```javascript
client.readWobble('wibble-id', 'wobble-id',
  function(err, wibble) {
    console.log(wibble);
  });
```

```python
wibble = wobbles.read_wibble(wobble_id, '2').json()
```

#### Example response

```json
{
  "id": "{wibble_id}",
  "type": "Wobble",
  "properties": {
    "prop0": "value0"
  }
}
```

### Delete a wibble

Removes a wibble from a wobble.

```endpoint
DELETE /wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id}
```

#### Example request

```javascript
client.deleteWobble('wibble-id', 'wobble-id', function(err, wibble) {
  if (!err) console.log('deleted!');
});
```

```curl
curl -X DELETE https://wobble.biz/wobbles/v1/{username}/{wobble_id}/wibbles/{wibble_id}
```

```python
resp = wobbles.delete_wibble(wobble_id, wibble_id)
```

```bash
$ wbl wobble delete-wibble wobble-id wibble-id
```

#### Example response

> HTTP 204
