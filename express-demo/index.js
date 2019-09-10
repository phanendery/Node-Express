//also call it app.js
const express = require("express");
//require joi
const Joi = require('joi'); //module returns class, has to be upperCase 

const app = express(); //this app is an object

app.use(express.json()); //to use parse of json objects, adding a piece of middleware
// to use this middleware in request process pipeline

// app.post()
// app.put()
// app.delete()

//how we defined a route
app.get("/", (req, res) => {
  //callback function is route handler
  res.send("hello world");
}); //takes two arguments, route and then call back function
//call back has request and response

app.get("/api/courses", (req, res) => {
  //real world scenario, makes db request here
  res.send(courses);
});

// /api/courses/1
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params); //this params will have the route in object format
  //u can add query string parameters after with ? to add additional data for backend purposes
  res.send(req.query);
  //query parameters in object with key value pairs
});

const courses = [
  { id: 1, name: "Javck" },
  { id: 2, name: "Paul" },
  { id: 3, name: "Lonny" },
  { id: 4, name: "JonDon" }
];

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //convert params to Int because its a string.
  if (!course) {
    //404 object not found
    res.status(404).send("The course with that id is invalid.");
    return;
  }
  res.send(course);
});

app.post("/api/courses", (req, res) => {

    const { error } = validateCourse(req.body); //use object destructuring
    if (error) {
        //400 means bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1, //future will be assigned by the database
        name: req.body.name //we have ab object with name property, to this to work we need to enable parsing of json objects
    };
     courses.push(course); //adding to our db in this case our array
     res.send(course); //convention wheen posting new server resource/object you should return that object in body of response
     //we need to add this to client because odds are client needs the id of new object
});

app.put('/api/courses/:id',(req,res)=>{
    //first need to look up the course with given id
    //if not there, return a 404 error
    //other wise we need to validate the course, if bad 400 error
    //if last step, we update the course and return the updated course to client

    //fetch course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        //404 object not found
        res.status(404).send("The course with that id is invalid.");
        return;
    }

    // const result = validateCourse(req.body);
    const {error} = validateCourse(req.body); //use object destructuring
    if (error) {
        //400 means bad request
        res.status(400).send(error.details[0].message);
        return; 
    }

    //update course and return
    course.name = req.body.name;
    res.send(course);
})

function validateCourse(course){
    //validate
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);

}

app.delete('/api/courses/:id', (req,res)=>{
    //Look up the course
    // if not there, return 404
    //then delete it and return the same course
    //finding the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        //404 object not found
        res.status(404).send("The course with that id is invalid.");
    }

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1) //deleting the course
    res.send(course);
})

//PORT is an environment variable, value is set outside the application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
