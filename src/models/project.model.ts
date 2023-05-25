import { Table, Column, Model, ForeignKey, BelongsTo, HasOne, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import DbCustomer from './customer.model';


@Table({
    tableName: "projekt",
    timestamps: true,
    createdAt: "erstelltam",
    updatedAt: "geaendertam",
})
export default class DbProject extends Model<DbProject> {
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
    
    @Column({
        type: DataTypes.STRING(5),
        field: "messenummer",
    })
    event_id!: string;

    @Column({
        type: DataTypes.STRING(3),
        field: "projektnr",
    })
    project_number!: string;

    @Column({
        type: DataTypes.STRING(6),
        field: "kostentrg",
        get() {
            return this.getDataValue('costunit_id').replace(/^\{+|\}+$/g, '');
        },
        set(val: string) {
            this.setDataValue('costunit_id', `{${val}}`);
        }
    })
    costunit_id!: string;

    @Column({
        type: DataTypes.STRING(2),
        field: "status",
    })
    status!: "AN" | "AG" | "AF" | "OE" | "AU" | "XX";
    @Column({
        type: DataTypes.DATE,
        field: "afdatum",
    })
    af_date!: string | null;

    @Column({
        type: DataTypes.DATE,
        field: "agdatum",
    })
    ag_date!: string | null;

    @Column({
        type: DataTypes.DATE,
        field: "audatum",
    })
    au_date!: string | null;

    @Column({
        type: DataTypes.STRING(15),
        field: "kundenbez",
    })
    customer_shortName!: string;

    @HasOne(() => DbCustomer, { foreignKey: "short_name", sourceKey: "customer_shortName" })
    customer!: DbCustomer;

    @Column({
        type: DataTypes.STRING(6),
        field: "kostentrg",
    })
    costunit_number!: string;  // TODO ADD COSTUNIT TABLE

    @Column({
        type: DataTypes.STRING(40),
        field: "projektbez",
    })
    title!: string;

    @Column({
        type: DataTypes.STRING(38),
        field: "bemguid",
    })
    description_id!: string; // TODO ADD BEMERKUNG TABLE

    @Column({
        type: DataTypes.FLOAT,
        field: "flaeche",
    })
    area!: number;

    @Column({
        type: DataTypes.FLOAT,
        field: "tiefe",
    })
    depth!: number;

    @Column({
        type: DataTypes.FLOAT,
        field: "front",
    })
    width!: number;

    @Column({
        type: DataTypes.STRING(4),
        field: "hallennummer",
    })
    hall_number!: string;

    @Column({
        type: DataTypes.STRING(38),
        field: "standnr",
    })
    booth_number!: string;

    @Column({
        type: DataTypes.STRING(5),
        field: "standart",
    })
    booth_type!: "KOPF" | "REIHE" | "ZELT" | "BLOCK" | "KEINE" | "ECK" | "PARTN";

    @Column({
        type: DataTypes.DATE,
        field: "geaendertam",
    })
    updatedAt!: Date;

    @Column({
        type: DataTypes.DATE,
        field: "erstelltam",
    })
    createdAt!: Date;

}

// Path: src\models\customer.model.ts
