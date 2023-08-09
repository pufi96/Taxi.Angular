import { IBase } from "src/app/shared/interfaces/i-base";

export interface ICarBase extends IBase {
    registration: string,
    validityOfRegistration: Date,
    mileage: number, 
    description: string,
    color: string,
    chassisNumber: string,
    engineVolume: number,
    horsePower: number,
    fuelTypeId: number,
    carModelId: number
}