import { Table, Column, Model, ForeignKey, BelongsTo, HasOne, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import DbProject from './project.model';

@Table({
    tableName: "kunde",
    timestamps: true,
    createdAt: "x1erstelltam",
    updatedAt: "x1geaendertam",
})
export default class DbCustomer extends Model<DbCustomer> {

    @Column({
        type: DataTypes.STRING(38),
        field: "xguid",
        primaryKey: true,
        get() {
            return this.getDataValue('id').replace(/^\{+|\}+$/g, '');
        },
        set(val: string) {
            this.setDataValue('id', `{${val}}`);
        }
    })
    id!: string;

    @ForeignKey(() => DbProject)
    @Column({
        type: DataTypes.STRING(15),
        field: "bez",
    })
    short_name!: string;

    @Column({
        type: DataTypes.STRING(30),
        field: "anrede",
    })
    name0!: string;

    @Column({
        type: DataTypes.STRING(45),
        field: "name1",
    })
    name1!: string;

    @Column({
        type: DataTypes.STRING(45),
        field: "name2",
    })
    name2!: string;

}

// Path: src\models\project.model.ts
