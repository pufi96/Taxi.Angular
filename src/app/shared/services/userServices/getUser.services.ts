import { Injectable } from "@angular/core";
import { ApiService } from "../api.services";
import { HttpClient } from "@angular/common/http";
import { apis } from "src/app/constants/api";
import { IUserBase, IUserShiftRide } from "../../interfaces/i-user";
import { IShiftRideCar } from "../../interfaces/i-shift";

@Injectable({
    providedIn: 'root'
})
export class GetUserServices extends ApiService<IUserShiftRide>{
    constructor(
        http: HttpClient
    ) {
        super(http, apis.user.user)
    }
}