# Proyecto Unidad 07
_Integrantes_
* Kimberly Pocco (ruta A1)
* Luis Huanca (ruta A2)

Estas instrucciones te permitir谩n obtener una copia del proyecto en funcionamiento en tu m谩quina local para prop贸sitos de desarrollo y pruebas.
Mira **Instalaci贸n** para conocer como desplegar el proyecto.
## Comenzando 馃殌

### Pre-requisitos 馃搵

_Que cosas necesitas para instalar el software y como instalarlas_

### Pasos a realizar para ejecutar:

Instalar dependencias

```
  npm install
```
Instalar el directorio dist
```
  npx tsc --init
```

Realizar migraciones

```
  npx prisma migrate dev --name init
```

Correr el proyecto

```
  npm run dev
```

# API

## Descripci贸n de Enpoints

### Crear usuario

```
  POST /api/v1/users
```

| Parameter | Type     |  
| :-------- | :------- | 
| name | `string` |
| password | `string` | 
| date_born | `date` | 

### Login

```
  POST /api/v1/users/login
```

| Parameter | Type     |           
| :-------- | :------- | 
| email | `string` | 
| password | `string` | 

### Crear canci贸n

```
  POST /api/v1/songs
```

| Parameter | Type     |           
| :-------- | :------- | 
| name | `string` | 
| artist | `string` | 
| album | `string` | 
| year | `int` | 
| genre | `string` | 
| duration | `int` |
| isPrivate | `boolean` | 

### Listar canciones logueandose
_Mostrar las canciones sean p煤blicas o privadas_

```
  POST /api/v1/songs/all
```

| Headers | Type     |           
| :-------- | :------- | 
| Authorization | `string` |

### Listar canciones sin loguearse
_脷nicamente se mostrar谩 las canciones publicas_

```
  GET /api/v1/songs/all
```

### Listar canci贸n por ID 
```
  GET /api/v1/songs/:id
```

| Parameter | Type     |           
| :-------- | :------- | 
| id | `int` |

 Headers | Type     |           
| :-------- | :------- | 
| Authorization | `string`|


### Crear playlist

```
  POST /api/v1/createplaylist
```

| Parameter | Type     |           
| :-------- | :------- | 
| name | `string` | 
| user_id | `int` | 


## A帽adir canci贸n a la playlist

```
  POST /api/v1/playlist
```

| Parameter | Type     |           
| :-------- | :------- | 
| id_song | `int` | 
| id_playlist | `int` | 

## Listar usuarios
```
  GET /
```






