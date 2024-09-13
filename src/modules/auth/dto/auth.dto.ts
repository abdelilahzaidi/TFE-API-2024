import { UserI } from "src/modules/user/interface/user.interface"

export interface SignInDTO {
    token: string,
    user: UserI
}

export interface UserInDTO {
    
    user: UserI
}

export function signInMapper(token: string, user: UserI): SignInDTO {
    delete user.password
    
    return { token, user }
}

export function userInMapper(user: UserI): UserInDTO {
    delete user.password
    return { user }
}