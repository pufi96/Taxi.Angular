import { Expression } from "@angular/compiler";
import { IBase } from "./i-base";
import { ICarBase } from "./i-car";
import { IRideBase } from "./i-ride";
import { IUserBase } from "./i-user";

export interface IShiftBase extends IBase {
    shiftStart: Date,
    shiftEnd: Date,
    mileageStart: number,
    mileageEnd: number,
    turnover: number,
    earnings: number,
    expenses: number,
    carModelId: number,
    description: string,
    carId: number,
    user: IUserBase,
    car: ICarBase
}

export interface IShiftRideCar extends IShiftBase{
    rides: null | IRideBase[],
    index: number
}

export interface IShiftCreate{
    mileageStart: number,
    userId: number,
    carId: number
}

export interface IShiftUpdate extends IShiftCreate{
    id: number,
    mileageEnd: number,
    expenses: number,
    description: string,
    userId: number
}