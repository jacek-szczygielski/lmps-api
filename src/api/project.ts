import express from 'express';
import DbProject from './../models/project.model';
import DbCustomer from './../models/customer.model';
import { Project, Projects } from '../api_types';
import { Attributes, WhereOptions } from 'sequelize/types/model';
import { Op } from 'sequelize';
import { convertDateFilter, convertStringFilter } from '../convert_query';
import { stringify } from 'qs';

const router = express.Router();

router.use(express.json());

function ApiNameToDatabaseName(name: string): string {
    switch (name) {
        case "created_at":
            return "createdAt";
        case "updated_at":
            return "updatedAt";
        default: {
            // console.error(`Unknown ApiNameToDatabaseName: ${name}`);
            return name;
        }
    }
}

router.get('/', async(req, res) => {
    // parse query params
    const q = req.query as Projects.GetProjects.RequestQuery
    const limit = parseInt(q.limit || "10");
    const page = parseInt(q.page || "1");
    // create filter
    const filter: WhereOptions<Attributes<DbProject>> = {};
    if (q.filter) {
        if (q.filter.af_date) {
            const date_filter = convertDateFilter(q.filter.af_date);
            if (date_filter instanceof Error) {
                res.status(400).send(`${date_filter.message} on field 'af_date'`);
                return;
            }
            filter.af_date = date_filter;
        }
        if (q.filter.ag_date) {
            const date_filter = convertDateFilter(q.filter.ag_date);
            if (date_filter instanceof Error) {
                res.status(400).send(`${date_filter.message} on field 'ag_date'`);
                return;
            }
            filter.ag_date = date_filter;
        }
        if (q.filter.au_date) {
            const date_filter = convertDateFilter(q.filter.au_date);
            if (date_filter instanceof Error) {
                res.status(400).send(`${date_filter.message} on field 'au_date'`);
                return;
            }
            filter.au_date = date_filter;
        }
        if (q.filter.booth_number) {
            const booth_number_filter = convertStringFilter(q.filter.booth_number);
            if (booth_number_filter instanceof Error) {
                res.status(400).send(`${booth_number_filter.message} on field 'booth_number'`);
                return;
            }
            filter.booth_number = booth_number_filter;
        }
        if (q.filter.costunit_id) {
            filter.costunit_id = q.filter.costunit_id
        }
        if (q.filter.created_at) {
            const date_filter = convertDateFilter(q.filter.created_at);
            if (date_filter instanceof Error) {
                res.status(400).send(`${date_filter.message} on field 'created_at'`);
                return;
            }
            filter.createdAt = date_filter;
        }
        if (q.filter.customer_id) {
            // get all customers with the given id
            const customers = await DbCustomer.findAll({
                where: {
                    id: q.filter.customer_id
                }
            });
            // get all short_names from the customers
            const project_ids = customers.map(customer => customer.short_name);
            // add the short_names to the filter
            filter.customer_shortName = {
                [Op.in]: project_ids
            }
        }
        // TODO: add filter for description, needs to be added to the models first
        // if (q.filter.description) {
        //     filter.description_id = convertStringFilter(q.filter.description);
        // }
        if (q.filter.event_id) {
            filter.event_id = q.filter.event_id
        }
        if (q.filter.project_number) {
            filter.project_number = q.filter.project_number;
        }
        if (q.filter.status) {
            filter.status = q.filter.status;
        }
        if (q.filter.updated_at) {
            const date_filter = convertDateFilter(q.filter.updated_at);
            if (date_filter instanceof Error) {
                res.status(400).send(`${date_filter.message} on field 'updated_at'`);
                return;
            }
            filter.updatedAt = date_filter;
        }
    }
    

    // check if sort.order field is valid
    if (q.sort?.order && !(["ASC", "DESC"].includes(q.sort?.order.toUpperCase()))) {
        res.status(400).send("Invalid sort order");
        return;
    }

    // get query result
    const query_result = await DbProject.findAll({
        where: filter,
        offset: (page - 1) * (limit || 10),
        limit: limit || 10,
        order: [[ApiNameToDatabaseName(q.sort?.field || "id"), (q.sort?.order || "ASC").toUpperCase()]],
        include: [{
            model: DbCustomer,
        }]
    }).catch((err) => {
        console.log(err);  // TODO: replace with logger
        res.status(500).send("Internal Server Error");
    })

    // exit if query_result is null
    if (!query_result) { return; }
    // get total count
    const count = await DbProject.count({ where: filter });
    // build querys for links for pagination
    const next_page_query: Projects.GetProjects.RequestQuery = {
        ...q,
        page: (page + 1).toString()
    }
    const prev_page_query: Projects.GetProjects.RequestQuery = {
        ...q,
        page: (page - 1).toString()
    }


    // create response data
    var res_data: Projects.GetProjects.ResponseBody = {
        data: [
            ...query_result.map((project: DbProject): Project => {
                return {
                    id: project.id,
                    project_number: project.project_number,
                    description: "TODO add description", // TODO: add description to model
                    booth_number: project.booth_number,
                    status: project.status,
                    af_date: project.af_date,
                    ag_date: project.ag_date,
                    au_date: project.au_date,
                    customer_id: project.customer.id,
                    area: project.area,
                    booth_type: project.booth_type,
                    costunit_id: project.costunit_id,
                    event_id: project.event_id,
                    depth: project.depth,
                    width: project.width,
                    hall_number: project.hall_number,
                    title: project.title,
                    created_at: project.createdAt ? project.createdAt.toISOString() : undefined,
                    updated_at: project.updatedAt ? project.updatedAt.toISOString() : undefined,
                }
            })
        ],
        meta: {
            pagination: {
                total: count,
                count: query_result.length,
                current_page: parseInt(q.page || "1"),
                per_page: parseInt(q.limit || "10"),
                total_pages: Math.ceil(count / (limit || 10)),
                links: {
                    next: query_result.length > 0 ? `${req.baseUrl}?${stringify(next_page_query)}` : "",
                    previous: (page || 1) > 1 ? `${req.baseUrl}?${stringify(prev_page_query)}` : ""
                }
            }
        }
    };
    
    // send response
    res.send(res_data);
});

router.get('/:id', async(req, res) => {
    // get id from url
    const id = req.params.id;
    // get query result
    const query_result = await DbProject.findByPk(`{${id}}`);
    // create response data
    if (query_result) {
        var res_data: Projects.GetProject.ResponseBody = {
            af_date: query_result.af_date,
            ag_date: query_result.ag_date,
            au_date: query_result.au_date,
            booth_number: query_result.booth_number,
            costunit_id: query_result.costunit_id,
            created_at: query_result.createdAt ? query_result.createdAt.toISOString() : undefined,
            customer_id: query_result.customer_shortName,
            description: "TODO add description", // TODO: add description to model
            event_id: query_result.event_id,
            id: query_result.id,
            project_number: query_result.project_number,
            status: query_result.status,
            updated_at: query_result.updatedAt ? query_result.updatedAt.toISOString() : undefined,
            area: query_result.area,
            booth_type: query_result.booth_type,
            depth: query_result.depth,
            hall_number: query_result.hall_number,
            title: query_result.title,
            width: query_result.width,
        };
        // send response
        res.send(res_data);
    } else {
        res.status(404).send({
            message: `Project with id ${id} not found`
        });
    }
});

// router.post('/', async(req, res) => {
//     // get request body
//     const req_body: Project = req.body;

//     // check if request body is valid
//     if (!req_body) {
//         res.status(400).send("Request body is empty");
//         return;
//     }

//     // create new db object
//     const new_project: DbProject = {
//         af_date: req_body.af_date || null,
//         ag_date: req_body.ag_date,
//         au_date: req_body.au_date,
//         booth_number: req_body.booth_number,
//         costunit_id: req_body.costunit_id,
//         customer_shortName: req_body.customer_id,
//         description: , // TODO: add description to model
//         event_id: req_body.event_id,
//         id: req_body.id,
//         project_number: req_body.project_number,
//         status: req_body.status,
//         area: req_body.area,
//         booth_type: req_body.booth_type,
//         depth: req_body.depth,
//         hall_number: req_body.hall_number,
//         title: req_body.title,
//         width: req_body.width,
//     };
//     // save new object
//     await new_project.save();
//     // send response
//     res.status(201).send(new_project);
// });

export default router;

// Path: src\api\project.ts
