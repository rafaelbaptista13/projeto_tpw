import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {ServicoslistService} from '../servicoslist.service';
import {CategoriaServico} from '../CategoriaServico';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';
import {CategoriasService} from '../categorias.service';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-servicoslist',
  templateUrl: './servicoslist.component.html',
  styleUrls: ['./servicoslist.component.css']
})
export class ServicoslistComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  servicosList: Servico[];
  institutos: Instituto[];
  categorias: CategoriaServico[];

  formGroup: FormGroup;
  formReady: boolean;


  constructor(private autenticacaoService: AutenticacaoService, private servicoslistService: ServicoslistService, private institutolistService: InstitutoslistService, private categoriasService: CategoriasService, private router: Router) {
    this.error = false;
    this.page_obj = true;
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
    }
    this.initForm();
    this.institutolistService.getListaInstitutos('','' ).subscribe(lista => { this.institutos = lista;
      this.categoriasService.getListaCategoriasServicos().subscribe(lista1 => {this.categorias = lista1;
        this.servicoslistService.getListaServicos('',-1, -1, '', '' ).subscribe(lista2 => {this.servicosList = lista2;
        },
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
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
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  initForm() {
    this.formGroup = new FormGroup({
      nome: new FormControl(''),
      precomin: new FormControl(''),
      precomax: new FormControl(''),
      instituto: new FormControl(''),
      categoria: new FormControl(''),
    });
    this.formReady = true;
  }

  pesquisa(): void {
    let instituto = this.formGroup.controls.instituto.value;
    let categoria = this.formGroup.controls.categoria.value;
    if (instituto === '') {
      instituto = undefined;
    }
    if (categoria === '') {
      categoria = undefined;
    }
    this.servicoslistService.getListaServicos(this.formGroup.controls.nome.value, instituto, categoria, this.formGroup.controls.precomin.value, this.formGroup.controls.precomax.value).subscribe(lista => { this.servicosList = lista; this.initForm();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  goToServico( servico: Servico) {
    this.router.navigate(['/servico', servico.id]);
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

}
