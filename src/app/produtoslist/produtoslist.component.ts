import { Component, OnInit } from '@angular/core';
import { Produto} from '../Produto';
import { ProdutoslistService} from '../produtoslist.service';
import {CategoriaProduto} from '../CategoriaProduto';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';
import {CategoriasService} from '../categorias.service';
import {AutenticacaoService} from '../autenticacao.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-produtoslist',
  templateUrl: './produtoslist.component.html',
  styleUrls: ['./produtoslist.component.css']
})
export class ProdutoslistComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  produtosList: Produto[];
  institutos: Instituto[];
  categorias: CategoriaProduto[];

  formGroup: FormGroup;
  formReady: boolean;


  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private produtoslistService: ProdutoslistService, private institutolistService: InstitutoslistService, private categoriasService: CategoriasService) {
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
    this.institutolistService.getListaInstitutos('','' ).subscribe(lista => { this.institutos = lista; },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.categoriasService.getListaCategoriasProdutos().subscribe(lista => this.categorias = lista,
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.produtoslistService.getListaProdutos('',-1, -1, '', '' ).subscribe(lista => { this.produtosList = lista; },
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
    this.produtoslistService.getListaProdutos(this.formGroup.controls.nome.value, instituto, categoria, this.formGroup.controls.precomin.value, this.formGroup.controls.precomax.value).subscribe(lista => { this.produtosList = lista; this.initForm();},
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
