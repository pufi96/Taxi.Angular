import { IBase } from "./i-base";
import { IShiftRideCar } from "./i-shift";

export interface IUserBase extends IBase {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    earnings: number,
    userRoleId: number
}

export interface IUserShiftRide extends IUserBase{
    shifts: IShiftRideCar[]
}
