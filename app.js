const express = require('express')
const data = require('./mock_data')
require('dotenv').config();
const app = express()

// Tell the express object to use the JSON format
app.use(express.json())

const { auth, requiresAuth } = require('express-openid-connect');
app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
    })
);

app.get("/sum", (request, response) => {
    let n1 = parseFloat(request.query.n1);
    let n2 = parseFloat(request.query.n2);

    let sum = n1 + n2;

    response.send(`Sum is: ${sum}`);
});

// req.isAuthenticated is provided from the auth router
app.get('/', (request, response) => {
    response.send(request.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.get("/users/all", (request, response) => {
    let users = data.get_all_users();
    response.send(users);
});

app.get("/users/by_id", (request, response) => {
    let users = data.get_user_by_user_id(parseInt(request.query.user_id));
    if (users) {
        response.send(users);
    }
    else response.status(404).send("user not found")
});

app.post("/user/add", (request, response) => {
    // We will assume that data is coming in request's body in JSON format.
    data.add_user(request.body);
    response.status(200).send(`Record added!`);
});


app.listen(3000, () => {
    console.log('Example app listening to port 3000')
})

