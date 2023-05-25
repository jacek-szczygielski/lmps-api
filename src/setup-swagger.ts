import { Router } from "express";

import swaggerui from 'swagger-ui-express';
import swaggerDocument from './openapi.json';

export default function setup_swagger(router: Router, url: string): void {
    router.use(url, swaggerui.serve, swaggerui.setup(swaggerDocument, { explorer: false }));
}

// Path: src\setup-swagger.ts
