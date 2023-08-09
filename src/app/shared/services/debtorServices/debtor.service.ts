import { ApiService } from "../api.services";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { apis } from "src/app/constants/api";
import { IDebtorBase } from "../../interfaces/i-debrot";

@Injectable({
    providedIn: 'root'
})

export class DebtorServices extends ApiService<IDebtorBase>{

    constructor(
        http: HttpClient
    ) {
        super(http, apis.debtor.debtor)
    }
}