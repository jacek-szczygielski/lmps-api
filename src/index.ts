import express from 'express';
import api from './api';
import connect from './database';
import setup_swagger from './setup-swagger';

const VERSION = 'v1';
const DEFAULT_API_PATH = `/api/${VERSION}`;
const DEFAULT_DOCUMENTATION_PATH = `/api-docs/${VERSION}`;
const PORT = 3000;

const app = express();

// set up swagger
if (process.env.NODE_ENV === "development") {
    const redirect_root_to_swagger = (process.env.REDIRECT_ROOT_TO_SWAGGER || "false") === "true";
    setup_swagger(app, DEFAULT_DOCUMENTATION_PATH, redirect_root_to_swagger)
    console.log(`Swagger will be available on http://localhost:${PORT}${DEFAULT_DOCUMENTATION_PATH}`)
}

// set up api
app.use(DEFAULT_API_PATH, api)

// connect to database and start server
connect().then(() => {
    console.log("Connection to Database has been established successfully.");
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}${DEFAULT_API_PATH}`);
    });
}).catch(err => {
    console.error("Unable to connect to the database:", err);
});

// Path: src\index.ts
