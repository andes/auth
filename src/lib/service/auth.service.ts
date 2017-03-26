import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Estado } from './estado.enum';
import { Server } from '@andes/shared';
let shiroTrie = require('shiro-trie');

@Injectable()
export class Auth {
    private jwtHelper = new JwtHelper();
    private shiro = shiroTrie.new();
    public estado: Estado;
    public usuario: any;
    public organizacion: any;
    private roles: string[];
    private permisos: string[];

    constructor(private server: Server) {
        // Si hay token, inicia la sesión
        let jwt = window.sessionStorage.getItem('jwt');
        if (jwt) {
            this.initFromToken(jwt);
        }
    };

    private initShiro() {
        this.shiro.reset();
        this.shiro.add(this.permisos);
    }

    private initFromToken(token: string): boolean {
        this.logout();
        if (!token) {
            return false;
        };

        try {
            if (!this.jwtHelper.isTokenExpired(token)) {
                // Login OK
                this.estado = Estado.activo;
                // Guarda el token para futura referencia
                window.sessionStorage.setItem('jwt', token);
                // Obtiene datos del usuario y permisos desde el token
                let payload = this.jwtHelper.decodeToken(token);
                this.usuario = payload.usuario;
                this.organizacion = payload.organizacion;
                this.roles = payload.roles;
                this.permisos = payload.permisos;
                this.initShiro();
                return true;
            } else {
                return false;
            }
        } catch (e) {
            this.estado = Estado.inactivo;
            return false;
        }
    }

    login(usuario: string, password: string, organizacion: string): Observable<any> {
        return this.server.post('/api/auth/login', { usuario: usuario, password: password, organizacion: organizacion }, { params: null, showError: false }).do((data) => {
            this.initFromToken(data.token);
        });
    }

    logout() {
        this.estado = Estado.inactivo;
        this.usuario = null;
        this.organizacion = null;
        this.roles = null;
        this.permisos = null;
        window.sessionStorage.removeItem('jwt');
    }

    organizaciones(): Observable<any> {
        return this.server.get('/auth/organizaciones');
    }

    check(string: string): boolean {
        return this.shiro.check(string);
    }

    getPermissions(string: string): string[] {
        return this.shiro.permissions(string);
    }

    loggedIn() {
        return this.estado === Estado.activo;
    }
}
