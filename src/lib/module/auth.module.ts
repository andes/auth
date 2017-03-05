import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../service/auth.service';

@NgModule({
    imports: [CommonModule],
    declarations: [],
    providers: [Auth]
})
export class AuthModule { }
