import { HttpClient } from "@angular/common/http";
import { apis } from "src/app/constants/api";
import { ApiService } from "../api.services";
import { ICarUpdate } from "src/app/shared/interfaces/i-car";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UpdateCarServices extends ApiService<ICarUpdate>{
    constructor(
        http: HttpClient
    ){
        super(http, apis.car.allCars)
    }
}
