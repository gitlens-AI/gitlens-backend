import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "repos",
})
class Repo extends Model<Repo> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare author: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare checkedTimes: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    declare score: number | null;
}

export default Repo;
