# Building-Block CONTROL DE VERSIONES 


El sistema es de utilidad para el proceso de desarrollo de una aplicación mobile o una ya desarrollada, permite gestionar diferentes aspectos vinculados a la relación entre una versión de una aplicación web o mobile con los servicios de backend que la misma utiliza.

El sistema a través de una API REST retornará la versión de servidor backend correcta para ese cliente, así como su URL base.

El módulo incorpora una funcionalidad que permite notificar al cliente mobile, en caso de que sea necesario “forzar” la actualización a una versión más reciente. La administración del catálogo de versiones que el API REST retorna, podrá hacerse también a través de una API o bien mediante una interfaz web sencilla.

Este módulo permite agilizar el proceso de desarrollo permitiendo la convivencia de múltiples versiones, teniendo control en runtime de la URL del backend que cada versión de la aplicación consume.

El sistema es deplegable en OCP como en Vmware, además dentro del repositorio podrá encontrar una aplicación cliente de ejemplo, para verificar el funcionamiento con el backend de quienes se quieran integrar. El backend cuenta con un frontend de gestión. 


# GUIA DE INSTALACION


## Installation

1. Clone the repository
2. Install dependencies
3. Set env variables
4. Create database

**Install dependencies**

Run <code>npm install</code> at server folder

Run <code>npm install</code> at client folder

**Set env variables - Client**

Create <code>.env.development</code> and <code>.env.production</code> files inside <code>client/</code> folder.

Use port `3002` for development and port `80` for production.

Example (include all of these):

    HOST=0.0.0.0
    PORT=3002
    REACT_APP_HOST=localhost
    REACT_APP_PORT=3001
    SKIP_PREFLIGHT_CHECK=true
    CHOKIDAR_USEPOLLING=true

Located at `client/.env.development`.

Note: if you change the ports change them in the dockerfiles too (root, server).

**Set env variables - Server**

Create <code>test.config.env</code>, <code>development.config.env</code> and <code>production.config.env</code> files inside <code>server/.env/</code> folder.

Use port `3001` for test, development and port `80` for production.

Example (include all of these):

    IP=0.0.0.0
    HOST=localhost
    PORT=3001
    CLIENT_HOST=localhost
    CLIENT_PORT=3002
    REDIS_URL=redis://redis:6379
    DB_HOST=[MONGOLAB_DB_URL]
    DB_USER=[MONGOLAB_DB_USERNAME]
    DB_PASS=[MONGOLAB_DB_PASSWORD]
    EMAIL_ADDRESS=[GMAIL_ADDRESS]
    EMAIL_PASS=[GMAIL_PASSWORD]

Located at `server/.env/development.config.env`.

Note: if you change the ports change them in the dockerfiles too (root, server).

**Create database**

Create MongoDB with a collection called `users`.

I've used the free service provided by [mLab](https://mlab.com/).

## Usage

Note: use the following commands at the root folder.

Development

1. Start <code>docker-compose -f docker-compose.development.yml up</code>
2. Go to <code>https://localhost:3001</code> in browser for server
3. Go to <code>http://localhost:3002</code> in browser for client

## Production

1. Run <code>npm run build</code>
1. Start <code>docker-compose -f docker-compose.production.yml up -d</code>
2. Go to <code>https://localhost:80</code> in browser

Note: run `npm rebuild node-sass` inside the client container if asked.

## Docker commands

Using separated docker-compose files for development and production.

**Development**

Start: `docker-compose -f docker-compose.development.yml up`<br>
Stop: `docker-compose -f docker-compose.development.yml stop`

**Production**

Start: `docker-compose -f docker-compose.production.yml up`<br>
Stop: `docker-compose -f docker-compose.production.yml down`

## Without docker

You have to set the environment you use in your scripts at `server/package.json`:

    "test": "set NODE_ENV=test&& mocha --exit --reporter spec \"src/*/*.test.js\"",
    "dev": "set NODE_ENV=development&& nodemon app.js -L --exec \"npm run test && npm run lint && node\"",
    "build": "set NODE_ENV=production&& webpack --config webpack.config.js",

Just overwrite the test, dev, build lines with the above.

## Development

1. Start <code>npm run dev</code> (or `dev:client` and `dev:server`)
2. Go to <code>https://localhost:3001</code> (server)
3. Go to <code>http://localhost:3002</code> (client)

## Production

1. Run <code>npm run build</code>
1. Start <code>npm start</code>
2. Go to <code>https://localhost:80</code>

Note: you may need to install nodemon: <code>npm install nodemon -g</code>

## Creating Super Admin user
This user is created after all container are up, it only runs once and you should edit the user parameters before running the docker-compose, to customize the credentials go to:

``` development.config.env```

here you can define your credentials:

```
SUPER_ADMIN_USERNAME=
SUPER_ADMIN_NAME=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_ROLE=

```
Then execute the following command to start the super admin user creation script:
```docker exec -d building_blocks_server npm run init-user```



## Before running the tests
1. After running the super admin script Add to the test.config.env the following data, 

```
SUPER_ADMIN_EMAIL='...'
SUPER_ADMIN_PASSWORD='...'

```
**NOTE:**

**This should we the super admin credentials, while running the test version, type, application and user application will be created to test the whole flow of the application including auth protection to the routes, at the end of each test file all will get removed.**

## How to run the tests through the docker container

1. First start the development container
2. then from the terminal execute the following command with the server container name
```docker exec -it building_blocks_server /bin/bash;```

#### important
If throws some dependency error like ```missing formidable module```, execute the next command:

```
npm install -d
```
Then run the tests command as usual
```
npm run test
```




## NPM Scripts

If you prefer not to use docker, you can use the following scripts from the root folder:

**npm run dev**

To use this command, you should install concurrently.<br>
It's prepared, just run `npm install` under the root folder.

**npm run dev:client**

Runs the react client in development mode.<br>
The browser will lint, reload if you make edits.

**npm run dev:server**

Runs the node server in development mode.<br>
The server will test, lint and reload if you make edits.

**npm run build**

Builds the complete application for production to the `build` folder.<br>

**npm start**

Runs the app in production mode with PM2 (cluster mode).

**npm stop**

Stops the application instances in PM2.

**npm run delete**

Removes the application instances from PM2.
