import User from "../models/user.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
    try {
        const adminEmail = "admin@admin.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });
            console.log("Admin user created successfully");
        } else {
            // console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};

export default seedAdmin;
