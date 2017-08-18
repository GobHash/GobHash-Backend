## Usando el API

Esta documentación está estrcturada por un API, que es un grupo de funcionalidades respecto a GobHash como red social o a la extracción de datos de GuateCompras. 
El API está compuesto de endpoints, que es un método específico dentro del API que realiza una acción y está ubicado en un URL específico.


Cada endpoint en esta documentación está descrita usando diversas partes

El método de HTTP: incluye GET, POST, PUT, PATCH, DELETE.
La ruta: por ejemplo, /v1/{mode}/{query}
Parámetros URL: son las partes de la ruta del punto final entre corchetes, como {mode} en este ejemplo.
Parámetros tipo query: son contenidos en una tabla con un encabezado de opción, estos se agregan a la parte de la cadena de consulta de la solicitud.


Todas las URL a las que se hace referencia en la documentación tienen la ruta base https://api.gobhash.com. Esta ruta de base va antes que la ruta del punto final. En este ejemplo, se combinan https://api.gobhash.com y /v1/. Donde v1 dice la versión del API actual.


Los parámetros de consulta (query params) se agregan al final de la URL con la codificación de cadena de consulta. Si desea agregar el parámetro de consulta de ordenamiento a una solicitud, debería usar la cadena de consulta? order_by = asc al final de la URL, produciendo https://api.gobhash.com/v1/search/user/?order_by=asc

Todos los endpoints necesitan un access token llamado JWT. Este token se genera una vez realizado un login exitoso y es necesario como header en cada request. El header a utilizar es Authentication: Bearer + token.