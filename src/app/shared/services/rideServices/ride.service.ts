import { HttpClient } from "@angular/common/http";
import { ApiService } from "../api.services";
import { apis } from "src/app/constants/api";
import { Injectable } from "@angular/core";
import { IRideBase } from "../../interfaces/i-ride";

@Injectable({
    providedIn: 'root'
})

export class RideService extends ApiService<any> {
    rides: IRideBase[];
    constructor(
        http: HttpClient
        ) {
        super(http, apis.ride.ride);
    }
}