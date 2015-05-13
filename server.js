'use strict';

// require core modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Sequelize = require('sequelize');
var sql = new Sequelize('aaronmartone', 'aaronmartone', 'mySecretPassword', { 
    dialect: 'postgres',
    hostname: 'localhost'
});

// define 'User' model.
// var User = sql.define('User', {
//     id: Sequelize.INTEGER.
//     name: Sequelize.STRING,
//     gender: Sequelize.STRING,
//     age: Sequelize.INTEGER
// });

// sql.sync();

app.route('/users')
    .get(function(req, res, next) {
        sql.query('SELECT * FROM users', { type: sql.QueryTypes.SELECT })
            .then(function(results) {
                console.log('GET /users...');
                res.json(results);
            });
    })
    .post(jsonParser, function(req, res, next) {
        var name = req.body.name || '';
        var gender = req.body.gender || '';
        var age = req.body.age || 0;
        sql.query("INSERT INTO users (name, gender, age) VALUES ( '" + name + "', '" + gender + "', " + age + " ) RETURNING id;",
                { type: sql.QueryTypes.SELECT }
            )
            .then(function(results) {
                console.log('POST /users...');
                res.json({ msg: 'success', id: results[0].id });
            });
    });

app.route('/users/:id')
    .get(function(req, res, next) {
        sql.query('SELECT * FROM users WHERE id = ' + req.params.id, { type: sql.QueryTypes.SELECT })
            .then(function(results) {
                console.log('GET /users/<id>...');
                res.json(results);
            });
    })
    .put(jsonParser, function(req, res, next) {
        sql.query("SELECT * FROM users WHERE id = " + req.params.id)
            .then(function(user) {
                sql.query("UPDATE users SET name = :name, gender = :gender, age = :age WHERE id = " + req.params.id,
                {
                    type: sql.QueryTypes.SELECT,
                    replacements: {
                        name: req.body.name,
                        gender: req.body.gender,
                        age: req.body.age
                    }
                })
                .then(function(results) {
                    console.log('PUT /users/<id>...');
                    res.json({ msg: 'success' });
                });
            });        
    })
    .delete(function(req, res, next) {
        sql.query("DELETE FROM users WHERE id = " + req.params.id, { type: sql.QueryTypes.SELECT })
            .then(function(resutls) {
                console.log('DELETE /users/<id>...');
                res.json({ msg: 'success' });
            });
    });

app.use(function(req, res) {
    console.log('Error 404');
    res.status(404)
        .set('Content-Type', 'application/json')
        .json({ msg: '404 - Resource not found' });
});

app.use(function(err, req, res) {
    console.log('Error 500', err.message, err.stack);
    res.status(500)
        .set('Content-Type', 'application/json')
        .json({ msg: '500 - Server encountered error' });
});

app.listen(3000, function() {
    console.log('Single Resource REST Sequelize app running on port 3000...');
})