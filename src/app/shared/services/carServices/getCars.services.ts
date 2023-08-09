import { HttpClient } from "@angular/common/http";
import { apis } from "src/app/constants/api";
import { ApiService } from "../api.services";
import { ICarBase } from "src/app/shared/interfaces/i-car";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GetCarsServices extends ApiService<ICarBase>{
    constructor(
        http: HttpClient
    ){
        super(http, apis.car.allCars)
    }
}
