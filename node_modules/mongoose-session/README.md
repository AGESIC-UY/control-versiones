# mongoose-session
## INACTIVE. Use connect-mongo instead. It's better anyways.

Express 4 Middleware for MongoDB Session Storage using the Mongoose ODM

## Installation

    npm install mongoose-session
    
## Usage

    var express = require('express');
    
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/db');
    
    var app = express();
    
    app.use(require('express-session')({
        key: 'session',
        secret: 'SUPER SECRET SECRET',
        store: require('mongoose-session')(mongoose)
    }));

## Options

mongoose-session accepts options as a second parameter.

* `options.ttl` : allowed time of inactivity before a session is destroyed, in seconds (3600)
* `options.modelName` : specifies the name of the collection, defaults to 'Session'
    
## Info

I am no longer actively working on this project, and this project SHOULD NOT be considered ready for production in any way, shape, or form. It is recommended that you use connect-mongo ([GitHub](https://github.com/kcbanner/connect-mongo)|[NPM](https://www.npmjs.com/package/connect-mongo)) instead. If anyone wants to take over this project, feel free to email me.
