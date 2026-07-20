import { AuthService, UserService } from "./auth.service.js";

const authService = new AuthService();
const userService = new UserService();

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.findUserByUsername(username);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const role = await authService.getUserRole(user.UserId);

        const isValid = await authService.verifyPassword(password, user.PasswordHash);

        if (!isValid) {
            return res.status(400).json({ message: "Wrong password" });
        }
        
        const token = await authService.generateToken(user.UserId, role.RoleName);

        res.json({
            message: "Login success",
            token,
            role: role.RoleName
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal error" });
    }
};

export const addNewAccount = async (req, res) => {
    try {
        const result = await userService.addNewAccount(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Insert error" });
    }
}

export const userInfo = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userService.getUserInfo(userId);
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "User found error" })
    }
};