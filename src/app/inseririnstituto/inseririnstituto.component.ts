import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AutenticacaoService} from '../autenticacao.service';
import {Router} from '@angular/router';
import {Instituto} from '../Instituto';
import {CategoriaProduto} from '../CategoriaProduto';
import {InstitutoslistService} from '../institutoslist.service';

@Component({
  selector: 'app-inseririnstituto',
  templateUrl: './inseririnstituto.component.html',
  styleUrls: ['./inseririnstituto.component.css']
})
export class InseririnstitutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;

  formReady: boolean;
  formGroup: FormGroup;

  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private institutoslistService: InstitutoslistService) {
    this.error = false;
    this.formReady = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUserUsername') != null) {
      this.userLogado = true;
    } else {
      this.userLogado = false;
    }
    if (this.userLogado) {
      this.userName = localStorage.getItem('currentUserUsername');
      this.autenticacaoService.getUser(this.userName).subscribe(result => {this.userId = result.id;
      },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    } else {
      this.router.navigate(['/home']);
    }
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      slogan: new FormControl('', [Validators.required]),
      localizacao: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  inserirProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      const fotopath = this.formGroup.controls.foto.value.substring(12, this.formGroup.controls.foto.value.length);
      this.autenticacaoService.getUser(this.userName).subscribe(dono => {
        const novoInstituto = new Instituto(this.formGroup.controls.nome.value, this.formGroup.controls.slogan.value, this.formGroup.controls.localizacao.value, this.formGroup.controls.email.value, this.formGroup.controls.website.value, fotopath, dono);
        this.institutoslistService.createInstituto(novoInstituto).subscribe(
          result => {this.router.navigate(['/geririnstitutos']);},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          }
          );
      },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    } else {
      this.error = true;
    }
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }


}
