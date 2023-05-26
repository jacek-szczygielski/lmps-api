import { Router } from "express";

import swaggerui from 'swagger-ui-express';
import swaggerDocument from './openapi.json';

export default function setup_swagger(router: Router, url: string, redirect_root: boolean = false): void {
    router.use(url, swaggerui.serve, swaggerui.setup(swaggerDocument, { explorer: false }));
    if (redirect_root) {
        router.get('/', (req, res) => {
            res.redirect(url);
        });
    }
}

// Path: src\setup-swagger.ts
