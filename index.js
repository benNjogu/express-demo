const Joi = require("joi");
const logger = require("./logger");
const authenticator = require("./authenticator");
const express = require("express");

const app = express();
app.use(express.json());

app.use(logger);

app.use(authenticator);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("course with the given ID not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error)
    //400 bad request
    return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up the course
  //if nonexisting return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("course with the given ID not found");

  //validate
  //if invalid, return 400, bad request
  const { error } = validateCourse(req.body);

  if (error)
    //400 bad request
    return res.status(400).send(error.details[0].message);

  //update course
  course.name = req.body.name;
  //return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  //Look up the course
  //not existing, return 404 not found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("course with the given ID not found");

  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
