import { Component, OnInit } from '@angular/core';
import {Instituto} from '../Instituto';
import {AutenticacaoService} from '../autenticacao.service';
import {InstitutoslistService} from '../institutoslist.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gestaoinstitutos',
  templateUrl: './gestaoinstitutos.component.html',
  styleUrls: ['./gestaoinstitutos.component.css']
})
export class GestaoinstitutosComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  institutosList: Instituto[] = [];

  constructor(private router: Router, private institutoslistService: InstitutoslistService, private autenticacaoService: AutenticacaoService) {
    this.error = false;
    this.page_obj = true;
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
    this.institutosList = [];
    this.institutoslistService.getListaInstitutos('','' ).subscribe(lista => {
      lista.forEach((element) => {
        //@ts-ignore
        if (element.dono === this.userId || this.userName === 'projeto') {
          this.institutosList.push(element);
        }
      });
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }


  editar(instituto: Instituto): void{
    this.router.navigate(['/editarinstituto', instituto.id]);
  }

  remover(instituto: Instituto): void {
    this.institutoslistService.dropInstituto(instituto.id).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

}
