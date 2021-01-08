import { Component, OnInit } from '@angular/core';
import {AutenticacaoService} from '../autenticacao.service';
import {Router} from '@angular/router';
import {CategoriasService} from '../categorias.service';
import {CategoriaProduto} from '../CategoriaProduto';
import {CategoriaServico} from '../CategoriaServico';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-areareservada',
  templateUrl: './areareservada.component.html',
  styleUrls: ['./areareservada.component.css']
})
export class AreareservadaComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  fotoInseridaServicos: string;
  nomeInseridoServicos: string;
  fotoInseridaProdutos: string;
  nomeInseridoProdutos: string;
  categoriasProdutos: CategoriaProduto[];
  categoriasServicos: CategoriaServico[];

  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formReady1: boolean;
  formReady2: boolean;

  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private categoriasService: CategoriasService) {
    this.formReady1 = false;
    this.formReady2 = false;
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
      if (this.userName !== 'projeto') {
        this.router.navigate(['/home']);
      }
      this.categoriasService.getListaCategoriasProdutos().subscribe(lista1 => {this.categoriasProdutos = lista1;},
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
      this.categoriasService.getListaCategoriasServicos().subscribe(lista2 => {this.categoriasServicos = lista2;},
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    }
    this.initForms();
  }

  initForms(): void {
    this.formGroup1 = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });
    this.formGroup2 = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });
    this.formReady1 = true;
    this.formReady2 = true;
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

  inserir1(): void {
    const fotopath = 'static/images/categoriasServicos/' + this.formGroup1.controls.foto.value.substring(12, this.formGroup1.controls.foto.value.length);
    const novacategoria = new CategoriaServico(this.formGroup1.controls.nome.value, fotopath);
    this.categoriasService.createCategoriaServico(novacategoria).subscribe(result => { this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  inserir2(): void {
    const fotopath = 'static/images/categoriasProdutos/' + this.formGroup2.controls.foto.value.substring(12, this.formGroup2.controls.foto.value.length);
    const novacategoria = new CategoriaProduto(this.formGroup2.controls.nome.value, fotopath);
    this.categoriasService.createCategoriaProduto(novacategoria).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  remover(categoria: CategoriaServico): void {
    this.categoriasService.dropCategoriaServico(categoria).subscribe(result => {console.log(result); this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }
  remover2(categoria: CategoriaProduto): void {
    this.categoriasService.dropCategoriaProduto(categoria).subscribe(result => {console.log(result); this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }
}
