import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apis } from "src/app/constants/api";
import { ApiService } from "./api.services";
import { Token } from "@angular/compiler";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { Router } from "@angular/router";


const token = 'token';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends ApiService<Token>{

    token: any;
    tokenPars: any;

    constructor(
        http: HttpClient,
        public router: Router
    ) {
        super(http, apis.auth.login)
        LayoutComponent.setLog(true);
        let encToken = window.sessionStorage.getItem("token");
        if (encToken) {
            this.parseToken(encToken);
        }
        this.token = window.sessionStorage.getItem("token");
    }

    public authData() {
        LayoutComponent.setLog(true);
        let encToken = window.sessionStorage.getItem("token");
        if (encToken) {
            this.parseToken(encToken);
        }
        this.token = window.sessionStorage.getItem("token");
    }

    public saveToken(tokenData: string): void {
        window.sessionStorage.removeItem(token);
        window.sessionStorage.setItem(token, tokenData);
    }

    parseToken(token: string): void {
        try {
            this.tokenPars = JSON.parse(atob(token.split(".")[1]));
        }
        catch (ex) {
            console.log(ex);
        }
    }

    public deleteToken(): void {
        LayoutComponent.setLog(false);
        this.token = null;
        window.sessionStorage.removeItem(token);
        this.router.navigateByUrl("/login", { state: { action: 'noAuth' } });
    }

}
