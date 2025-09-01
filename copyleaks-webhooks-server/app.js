const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors");
const http = require('http')
const WebSocket = require('ws');
const { Copyleaks } = require('plagiarism-checker');
require('dotenv').config();

const axios = require("axios")

const copyleaks = new Copyleaks();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("server")
app.use(cors());
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/static', express.static('public'))

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);
    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

app.get("/", (req, res) => {
    res.status(200);
    res.send("Server is up and running");
})

app.post("/token", (req, res) => {
    const EMAIL = req.body.username;
    const API_KEY = req.body.apikey
    copyleaks.loginAsync(EMAIL, API_KEY).then((response) => {
        res.send(response);
    })
        .catch((error) => {
            console.log(error)
        })
})

app.post("/scan/:id", async (req, res) => {
    const authToken = req.headers.authorization;
    const scanId = req.params.id
    const modelBody = req.body;
    try {
        const scanResponse = await axios.put(`${process.env.COPYLEAKS_BASE_URL}/submit/file/${scanId}`, modelBody, {
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            }
        })
        if(scanResponse){
            console.log(scanResponse)
            res.send(scanResponse)
        }
    } catch (error) {
        console.error('Failed to submit file:', error);
        res.send(error)
    }
})

app.post("/webhooks", (req, res) => {
    const requestData = req.body;
    console.log("Received webhook data:", requestData);
    res.status(200).end()

    try {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(requestData));
            }
        });
    } catch (error) {
        console.log("Error processing webhook:", error.message);
    }
})

app.post("/newResult", (req, res) => {
    const requestData = req.body;
    console.log("Received newresult data:", requestData);
    res.status(200).end()

    try {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(requestData));
            }
        });
    } catch (error) {
        console.log("Error processing webhook:", error.message);
    }
})

//completed webhook for export
app.post("/webhooks/export/:exportid/completed",(req, res) =>{
    console.log(req, res)
    res.status(204).end()
})

app.get("/resend/:scanid", async (req, res) => {
    const scanId = req.params.scanid;
    const authToken = req.headers.authorization;
    try {
        const response = await fetch(`${process.env.COPYLEAKS_BASE_URL}/${scanId}/webhooks/resend`, {
            method: "POST",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            const data = await response.json(); // Parse response properly
            return res.status(response.status).json({
                success: false,
                message: `No scanned items are found`,
                data: data,
                status: response.status
            })
        }

        //const data = await response.json();
        return res.status(response.status).json({
            success: true,
            message: "Scan result resend request sent!",
            data: "Scan result resend request sent!",
            status: response.status
        })
    } catch (error) {
        console.error("Error fetching scan results:", error);
        return res.status(500).json({
            success: false,
            message: "Scan results not available",
            error: error.message,
            status: error.status
        })
    }
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})