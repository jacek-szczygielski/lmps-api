import { Op } from 'sequelize';

export type StringFilter = string | { [Op.like]?: string, [Op.startsWith]?: string, [Op.endsWith]?: string, [Op.eq]?: string, [Op.contains]?: string };
export type DateFilter = { [Op.lte]?: Date, [Op.gte]?: Date, [Op.between]?: [Date, Date] };

// Path: src\db_types.d.ts
