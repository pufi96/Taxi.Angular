import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apis } from "src/app/constants/api";
import { Token } from "@angular/compiler";
import { ApiService } from "../api.services";

@Injectable({
    providedIn: 'root'
})

export class LoginService extends ApiService<Token>{

    constructor(
        http: HttpClient
    ) {
        super(http, apis.auth.login)
    }
}
