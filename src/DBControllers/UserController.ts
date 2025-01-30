import User from "../models/User.model";

class UserController {
    addUser = async (address: string, hasWhitelist?: boolean) => {
        try {
            const user = await User.create({ address, hasWhitelist } as User);
            return user;
        } catch (e: any) {
            console.error("UserController addUser error:", e.message);
            return null;
        }
    };

    getUser = async (address: string) => {
        try {
            const user = await User.findOne({ where: { address } });
            return user;
        } catch (e: any) {
            console.error("UserController getUser error:", e.message);
            return null;
        }
    };
}

export default new UserController();
