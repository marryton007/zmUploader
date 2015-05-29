'use strict';

var express = require('express'),
    debug = require('debug')('fineuploader'),
    path = require('path');

var bodyParser = require('body-parser'),
    multer = require('multer');

var favicon = require('serve-favicon'),
    User = require('./lib/user'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy;    

// force download
var contentDisposition = require('content-disposition');

module.exports = function(handlerModule, opts){
    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'web/views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));

    // request body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));

    //passport 
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // multipart request body parser
    app.use(multer());

    // routers 
    app.use('/', require('./lib/routes'));
    app.all('/public', isLoggedIn);
    app.all('/getall', isLoggedIn);
    app.all('/delteall', isLoggedIn);

    // static site hosting
    if (opts.static) {
        debug("Hosting static files from: " + opts.static);
        app.use('/public', express.static(opts.static));
    }

    if (opts.uploads) {
        debug("uploads directory is :" + opts.uploads);
        app.use('/upfiles', express.static(path.join(opts.uploads, 'uploads'), {'setHeaders':setHeaders}));
    }

    // specification for routes
    var routes = {
        // traditional endpoint specification
        upload: {
            method: 'post',
            url: '/upload'
        },
        delete: {
            method: 'delete',
            url: '/upload/:uuid'
        },
        getall:{
            method: 'get',
            url: '/getall'
        },
        deleteall:{
            method: 'get',
            url: '/deleteall'
        },
        // s3 endpoint specification
        sign: {
            method: 'post',
            url: '/sign'
        },
        success: {
            method: 'post',
            url: '/success'
        }
    };

    // require the module which handles requests based on the `routes`
    // defined above.
    // (traditional, s3, etc...)
    var uploadHandlerModule = require('./lib/' + handlerModule),
        uploadHandler = uploadHandlerModule(opts);


    // apply the handler methods to the express application
    Object.keys(uploadHandler).forEach(function(handler_name){
        var route_spec = routes[handler_name],
            handler = uploadHandler[handler_name];

        if (route_spec){
            var method = route_spec.method,
                url = route_spec.url;

            app[method](url, handler);
        }
    });

    // Set header to force download
    function setHeaders(res, path) {
      res.setHeader('Content-Disposition', contentDisposition(path))
    }

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }

    return app;
};

