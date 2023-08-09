import { IBase } from "src/app/shared/interfaces/i-base";
import { ILocationPrice } from "./i-locationPrice";
import { IDebtorBase } from "./i-debrot";

export interface IRideBase extends IBase {
    isLocal: boolean,
    ridePrice: number,
    locationPrice: null | ILocationPrice,
    debtorId: number,
    debtor: null | IDebtorBase,
    index: number,
    locationEnd: null | string,
    locationStart: null | string,
    locationPriceId: null | number
}

export interface IRideCreate {
    isLocal: boolean,
    ridePrice: number,
    locationPriceId: null | number,
    shiftId: number,
    debtorId: null | number
}