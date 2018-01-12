const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

let callsToServer = 0
app.use((req, res, next) => {
    console.log("First Middleware", callsToServer)
    next()
})

app.use((req, res, next) => {
    callsToServer++
    next()
})

app.use((req, res, next) => {
    console.log("Time of Request", Date.now())
    console.log("Last Middleware", callsToServer)    
    console.log("Request Body", req.body)
    console.log("Person Value at time of request", person)
    next()
})

app.use((req, res, next) => {
    const auth = req.get("Authorization")
    if(auth === "IAmDanny"){
        console.log("Admin in da hauz")
    } else if (auth === "IAmGroot") {
        console.log("User is present")
    } else {
        console.log("Invalid Auth Header: Treating you as a guest")
        //res.status(403).send("Invalid Auth Header")
    }
    next()
})

app.get('/', (req, res) => res.send('Hello World from Danny Warren!'))

let person = {}

app.get("/person", (req, res) => res.send(person))

app.post("/person", (req, res) => {
    person = req.body
    res.send("Saved Person")
})

app.post("/personError", (req, res) => {
    person = req.body
    throw new Error("Failed to process post")
    res.send("Saved Person")
})

app.delete("/person", (request, response) => {
    person = {}
    res.send("Deleted Person")
})

app.use((err, req, res, next) => {
    console.log("Error Handling:", err)
    res.status(503).send("Failed to find post")
    //next()
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))