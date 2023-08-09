import { HttpClient } from "@angular/common/http";
import { ApiService } from "../api.services";
import { apis } from "src/app/constants/api";
import { Injectable } from "@angular/core";
import { IShiftBase } from "../../interfaces/i-shift";
import { AuthService } from "../auth.services";

@Injectable({
    providedIn: 'root'
})

export class ShiftService extends ApiService<any> {
    shifts: IShiftBase[];
    constructor(
        http: HttpClient
        ) {
        super(http, apis.shift.shift);
    }
}