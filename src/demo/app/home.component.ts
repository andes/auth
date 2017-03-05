import { Component } from '@angular/core';
import { Auth } from '../../lib/';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  public checkId = 'xpc4000';
  public usuario = '26108063';
  public password = '12345';

  constructor(public auth: Auth) {
  }

  actualizar() {
    this.auth.actualizarPermisos();
  }

  login() {
    this.auth.login(this.usuario, this.password).subscribe((data) => { });
  };
}
