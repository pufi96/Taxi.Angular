import { IBase } from "./i-base";
import { ICarBrand } from "./i-carBrand";

export interface ICarModel extends IBase{
    carModelName: string,
    carBrandId: number
}