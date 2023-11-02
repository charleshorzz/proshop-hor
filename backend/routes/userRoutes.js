import express from "express";
import { authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.route('/').post(registerUser).get(protect, admin, getUsers);
userRoutes.post('/logout', logoutUser);
userRoutes.post('/login', authUser);
userRoutes.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
userRoutes.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser); 

export default userRoutes;