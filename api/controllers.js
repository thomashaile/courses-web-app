'use strict'

const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const config = require('../config');
const util = require('util');
const courses = require("../data/courses.json");
//file path
const DATA_DIR = path.join(__dirname, "/..", config.DATA_DIR, "/courses.json");


const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const unLink = util.promisify(fs.unlink);

const controllers = {
    home: async(req, res) => {
        try {
            return await res.json({ api: 'courses!' });
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    },
    //list all courses
    courses: async(req, res) => {
        try {
            const listCourses = await readFile(DATA_DIR, 'utf-8');
            return await res.send(JSON.parse(listCourses)); //list all courses
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    },
    //search course by id
    singleCourse: async(req, res) => {
        try {
            const courseList = await readFile(DATA_DIR, "utf-8");
            const parsedCourse = JSON.parse(courseList);
            let course = parsedCourse.find(c => c.id === JSON.parse(req.params.id));
            if (!course) return res.status(404).send('The course with the given ID was not found');
            return res.json({ status: "Ok", course });
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    },
    //add new course
    addCourse: async(req, res) => {
        const courseName = req.body.fileName;
        try {
            const courseList = await readFile(DATA_DIR, "utf-8");
            const parsedCourse = JSON.parse(courseList);
            const course = {
                id: parsedCourse.length + 1,
                name: courseName,
            };
            courses.push(course);
            // console.log(courses);
            let objToString = JSON.stringify(courses);
            await writeFile(DATA_DIR, objToString);
            return await res.redirect(303, '/api/courses');
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    },
    //update course 
    updateCourse: async(req, res) => {
        const newName = req.body.name;
        try {
            const courseList = await readFile(DATA_DIR, "utf-8");
            const parsedCourse = JSON.parse(courseList);
            let course = parsedCourse.find(c => c.id === JSON.parse(req.params.id));
            if (!course) return res.status(404).send('The course with the given ID was not found');
            course.name = newName;
            courses.push(course);
            let objToString = JSON.stringify(parsedCourse);
            await writeFile(DATA_DIR, objToString);
            console.log(objToString);
            res.status(200).send('course updated successfully ...');
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    },
    //delete course by id
    deleteCourse: async(req, res) => {
        try {
            const courseList = await readFile(DATA_DIR, "utf-8");
            const parsedCourse = JSON.parse(courseList);
            let course = parsedCourse.find(c => c.id === JSON.parse(req.params.id));
            if (!course) return res.status(404).send('The course with the given ID was not found');
            let index = parsedCourse.indexOf(course);
            parsedCourse.splice(index, 1);
            let objToString = JSON.stringify(parsedCourse);
            await writeFile(DATA_DIR, objToString);
            res.status(200).send('Course Deleted Successfully ...');
        } catch {
            return await res.json({ status: 'error', message: 'Something went wrong...' });
        };
    }

};

module.exports = controllers;