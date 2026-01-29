import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import UserService from '../modules/services/user.service';

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.createNewUser);
        this.router.post(`${this.path}/auth`, this.authenticateUser);
        this.router.delete(`${this.path}/logout/:userId`, this.logoutUser);
    }

    private createNewUser = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        try {
            await this.userService.createUser(userData);
            response.status(200).json({ message: 'Użytkownik utworzony!' });
        } catch (error) {
            response.status(400).json({ error: 'Błąd rejestracji' });
        }
    };

    private authenticateUser = async (request: Request, response: Response, next: NextFunction) => {
        const { login, password } = request.body;
        try {
            const tokenData = await this.userService.authenticate(login, password);
            if (tokenData) {
                response.status(200).json(tokenData);
            } else {
                response.status(401).json({ error: 'Błędny login lub hasło' });
            }
        } catch (error) {
            response.status(500).json({ error: 'Błąd serwera' });
        }
    };

    private logoutUser = (request: Request, response: Response, next: NextFunction) => {

        response.status(200).json({ message: 'Wylogowano pomyślnie' });
    };
}

export default UserController;