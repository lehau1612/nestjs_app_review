

export interface IUsers_Profile {
    userId: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: Date;
    roleId: number
    managerId: number  
    position: string  
    groupId: number[]
}

export interface IUsers {
    userId: number
    email: string
    roleName: string
    managerId: number 
}


export interface IManagerReview {
    userId: number,
    configId: number,
    pointManager: number
}



