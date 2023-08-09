import { Injectable } from "@angular/core";
import { ILocation } from "../../interfaces/i-location";
import { ApiService } from "../api.services";
import { HttpClient } from "@angular/common/http";
import { apis } from "src/app/constants/api";

@Injectable({
    providedIn: 'root'
})
export class LocationServices extends ApiService<ILocation>{
    constructor(
        http: HttpClient
    ){
        super(http, apis.location.allLocations)
    }
}