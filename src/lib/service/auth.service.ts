import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Estado } from './estado.enum';
import { Server } from '@andes/shared';
import { tap, publishReplay, refCount } from 'rxjs/operators';
const shiroTrie = require('shiro-trie');

interface IOrganizacion {
    id: string;
    nombre: string;
}

interface IUsuario {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    nombreCompleto: string;
    username: string;
}

@Injectable()
export class Auth {
    private shiro = shiroTrie.new();
    public estado: Estado;
    public usuario: IUsuario;
    public organizacion: IOrganizacion;
    public profesional: string;
    public orgs = [];
    private roles: string[];
    private permisos: string[];

    private session$: Observable<any>;

    constructor(private server: Server) { };

    private initShiro() {
        this.shiro.reset();
        this.shiro.add(this.permisos);
    }

    getToken() {
        return window.sessionStorage.getItem('jwt');
    }

    setToken(token: string) {
        window.sessionStorage.setItem('jwt', token);
    }

    login(usuario: string, password: string): Observable<any> {
        return this.server.post('/auth/login', { usuario: usuario, password: password }, { params: null, showError: false }).pipe(
            tap((data) => {
                this.setToken(data.token);
                this.estado = Estado.inProgress;
            })
        );
    }

    logout() {
        this.estado = Estado.logout;
        this.usuario = null;
        this.organizacion = null;
        this.roles = null;
        this.permisos = null;
        this.session$ = null;
        window.sessionStorage.removeItem('jwt');
    }

    check(string: string): boolean {
        return this.shiro.check(string);
    }

    getPermissions(string: string): string[] {
        return this.shiro.permissions(string);
    }

    loggedIn() {
        return this.estado === Estado.active;
    }

    inProgress() {
        return this.estado === Estado.inProgress;
    }

    /**
     *
     * @param force Fuerza la busqueda de los datos de session. Default: false
     */
    session(force = false) {
        if (!this.session$ || force) {
            this.session$ = this.server.get('/auth/sesion').pipe(
                tap((payload) => {
                    this.usuario = payload.usuario;
                    this.organizacion = payload.organizacion;
                    this.profesional = payload.profesional;
                    this.permisos = payload.permisos;
                    this.estado = Estado.active;
                    this.initShiro();
                }),
                publishReplay(1),
                refCount()
            );
        }
        return this.session$;
    }

    organizaciones(): Observable<any> {
        return this.server.get('/auth/organizaciones').pipe(
            tap((data) => {
                this.orgs = data;
            })
        );
    }

    setOrganizacion(org: any): Observable<any> {
        return this.server.post('/auth/v2/organizaciones', { organizacion: org._id }).pipe(
            tap((data) => {
                this.setToken(data.token);
                this.estado = Estado.active;
            })
        );
    }



}
