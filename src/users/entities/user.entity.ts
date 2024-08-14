import { $Enums, User } from "@prisma/client";

export class UserEnity implements User {
    id: string;
    username: string;
    email: string;
    password: string;
    apiKey: string;
    image: string;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;
}
