import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    static async listUsers(req: Request, res: Response) {
        try {
            const users = await UserService.listUsers();

            res.send({ users })
        } catch (error) {
            console.log(error);

            res.status(400).send({ message: "an error occured" })
        }
    }


    static async getUserDetails(req: Request, res: Response) {
        try {
            const user = await UserService.getUser(req.params.userId);
            res.send({ user })
        } catch (error) {
            console.log(error);

            res.status(400).send({ message: "an error occured" })
        }
    }

    static async updateUserDetails(req: Request, res: Response) {
        try {
            await UserService.updateUser(req.params.userId, req.body);
            res.send({ message: "user updated successfully" })
        } catch (error) {
            console.log(error);

            res.status(400).send({ message: "an error occured" })
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            await UserService.deleteUser(req.params.userId);
            res.send({ message: "user deleted successfully" })
        } catch (error) {
            console.log(error);

            res.status(400).send({ message: "an error occured" })
        }
    }

}