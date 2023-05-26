import { StringFilter as DbStringFilter, DateFilter as DbDateFilter } from "./db_types";
import { Op } from "sequelize";
import { StringFilter, DateFilter } from "./api_types";

export function convertStringFilter(filter: StringFilter | undefined): DbStringFilter | Error | undefined {
    if (!filter) return undefined;
    if (!filter.value) return new Error("Invalid filter value");
    if (filter.type === 'equals') {
        return {
            [Op.eq]: filter.value
        }
    } else if (filter.type === 'contains') {
        return {
            [Op.like]: `%${filter.value}%`
        }
    } else if (filter.type === 'starts_with') {
        return {
            [Op.startsWith]: filter.value
        }
    } else if (filter.type === 'ends_with') {
        return {
            [Op.endsWith]: filter.value
        }
    } else {
        return new Error("Invalid filter type");
    }
}

export function convertDateFilter(filter: DateFilter | undefined): DbDateFilter | Error | undefined {
    if (!filter) return undefined;
    if (!filter.date) return new Error("Invalid filter date");
    if ((filter.type === 'between') && (filter.date?.length || 0 >= 2) && (filter.date[0] && filter.date[1])) {
        return {
            [Op.between]: [new Date(filter.date[0]), new Date(filter.date[1])]
        }
    } else if (filter.type === 'after') {
        if (filter.date instanceof Array) {
            return {
                [Op.gte]: new Date(filter.date[0])
            }
        } else {
            return {
                [Op.gte]: new Date(filter.date as unknown as string)
            }
        }
    } else if (filter.type === 'before') {
        if (filter.date instanceof Array) {
            return {
                [Op.lte]: new Date(filter.date[0])
            }
        } else {
            return {
                [Op.lte]: new Date(filter.date as unknown as string)
            }
        }
    } else {
        return new Error("Invalid filter type");
    }
}

// Path: src\api\project.ts
