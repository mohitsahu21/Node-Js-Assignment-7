const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

const studentData = require('./InitialData')
let nextId = studentData.length+1;


// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
app.get('/api/student',(req,res) => {
    res.status(200).json(studentData)
})
app.get('/api/student/:id',(req,res) => {
    const {id} = req.params;
   
    studentData.map( (student) => { 
        if(student.id == id) {
           return  res.status(200).json(student)
        }
    })
    res.status(404).send("invalid id")

})
app.post('/api/student', (req,res) => {
    
    const {name,currentClass,division} = req.body;
    if (!name || !currentClass || !division) {
         res.status(400).send("Incomplete student details")
         return;
    }
    
    else{
        const newStudent = {
            id : nextId++ ,
            name : name,
            currentClass : currentClass,
            division : division

        }
        studentData.push(newStudent);
        res.status(201).json({id : newStudent.id });
    }
  
})

app.put('/api/student/:id', (req,res) => {
    
    const {id} = req.params;
    const {name} = req.body;
    if (!name){
        res.status(400).send('invalid update');
        return;
    }
    const student = studentData.find((data) => data.id == id);
    if (student) {
        student.name = name;
        res.status(200).json(student)
    }
    else {
        res.status(400).send("Invalid id")
    }
});

app.delete('/api/student/:id',(req,res) => {
    const {id} = req.params;
    
    const studenId = studentData.findIndex((s) => s.id == id)
    if ( studenId != -1){
        studentData.splice(studenId,1);
        res.status(200).send("Student deleted")
    }
    else{
        res.status(404).send("Student not found")
    }
});






app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   