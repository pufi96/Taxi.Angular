import { IBase } from "src/app/shared/interfaces/i-base";

export interface IDebtorBase extends IBase {
    debtorFirstName: string,
    debtorLastName: string,
    debtorFullName: string,
    description: string
}
