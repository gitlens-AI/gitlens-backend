import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "users",
})
class User extends Model<User> {
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
        unique: true,
    })
    declare address: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare hasWhitelist: boolean;
}

export default User;
