import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Estado } from './estado.enum';
import { Server } from '@andes/shared';
import { Usuario } from './usuario.interface';
import { Organizacion } from './organizacion.interface';
let shiroTrie = require('shiro-trie');

@Injectable()
export class Auth {
    private jwtHelper = new JwtHelper();
    private shiro = shiroTrie.new();
    public estado: Estado;
    public usuario: Usuario;
    public organizacion: Organizacion;
    public roles: string[];
    public permisos: string[];

    constructor(private server: Server) {
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
            return false;
        }
    }

    login(usuario: string, password: string): Observable<any> {
        return this.server.post('http://localhost:3002/api/auth/login', { usuario: usuario, password: password }).do((data) => {
            this.initFromToken(data.token);
        });
    }

    logout() {
        this.estado = Estado.inactivo;
        this.usuario = null;
        window.sessionStorage.removeItem('jwt');
    }

    check(string: string): boolean {
        return this.shiro.check(string);
    }

    loggedIn() {
        return this.estado === Estado.activo;
    }

    actualizarPermisos() {
        this.initShiro();
    }
}
