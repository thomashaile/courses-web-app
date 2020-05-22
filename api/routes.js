const controllers = require('./controllers');
const express = require('express');
const path = require('path');
const routes = express.Router();

routes.get('/', controllers.home);

// write your routes
routes.get('/courses', controllers.courses);
routes.get('/courses/:id', controllers.singleCourse);
routes.post('/courses', controllers.addCourse);
routes.put('/courses/:id', controllers.updateCourse);
routes.delete('/courses/:id', controllers.deleteCourse);

module.exports = routes;