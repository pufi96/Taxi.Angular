import { IBase } from "src/app/shared/interfaces/i-base";

export interface ILocationPrice extends IBase {
    locationStart: string,
    locationEnd: string,
    price: number,
    locationPriceNameFiltered: string;
}
