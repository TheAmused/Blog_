import UserModel from '../schemas/user.schema';
import jwt from 'jsonwebtoken';

class UserService {
    private readonly secret = 'tajne_haslo_aplikacji_taw';

    public async createUser(userParams: any) {
        try {
            const newUser = new UserModel(userParams);
            await newUser.save();
        } catch (error) {
            console.error('Błąd tworzenia użytkownika:', error);
            throw new Error('Nie udało się utworzyć użytkownika (email lub login jest zajęty)');
        }
    }

    public async authenticate(login: string, password: string): Promise<any> {
        const user: any = await UserModel.findOne({
            $or: [
                { email: login },
                { name: login }
            ]
        });

        if (!user) {
            return null;
        }

        if (user.password === password) {
            const token = jwt.sign(
                { userId: user._id, name: user.name, email: user.email },
                this.secret,
                { expiresIn: '1h' }
            );
            return { token: token };
        }

        return null;
    }
}

export default UserService;