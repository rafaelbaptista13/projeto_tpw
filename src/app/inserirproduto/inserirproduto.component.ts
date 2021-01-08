import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Instituto} from '../Instituto';
import {CategoriaProduto} from '../CategoriaProduto';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {CategoriasService} from '../categorias.service';
import {InstitutoslistService} from '../institutoslist.service';
import {ProdutoslistService} from '../produtoslist.service';
import {Produto} from '../Produto';

@Component({
  selector: 'app-inserirproduto',
  templateUrl: './inserirproduto.component.html',
  styleUrls: ['./inserirproduto.component.css']
})
export class InserirprodutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;

  formReady: boolean;
  formGroup: FormGroup;
  categorias: CategoriaProduto[];
  institutos: Instituto[] = [];
  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private produtoslistService: ProdutoslistService, private categoriasService: CategoriasService, private institutoslistService: InstitutoslistService) {
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
    this.categoriasService.getListaCategoriasProdutos().subscribe(lista => {this.categorias = lista;},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.institutos = [];
    this.institutoslistService.getListaInstitutos('','').subscribe(lista => {
      lista.forEach((element) => {
        //@ts-ignore
        if (element.dono === this.userId) {
          this.institutos.push(element);
        }
      });
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      })
    this.formGroup = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      descricao: new FormControl('', [Validators.required]),
      preco: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      instituto: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  inserirProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      const fotopath = this.formGroup.controls.foto.value.substring(12, this.formGroup.controls.foto.value.length);
      let categoriaselecionada;
      const institutosselecionados = [];
      this.formGroup.controls.instituto.value.forEach((elemento) => {
        this.institutoslistService.getInstitutoById(elemento).subscribe(result => {
          institutosselecionados.push(result);},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          });
      });
      this.categoriasService.getCategoriaProdutoById(this.formGroup.controls.categoria.value).subscribe(result => {categoriaselecionada = result;
        this.autenticacaoService.getUser(this.userName).subscribe(dono => {
          const novoProduto = new Produto(this.formGroup.controls.nome.value, this.formGroup.controls.descricao.value, this.formGroup.controls.preco.value, this.formGroup.controls.quantidade.value, categoriaselecionada, fotopath, dono);institutosselecionados.forEach((elemento) => {
            novoProduto.addInstituto(elemento);
          });
          this.produtoslistService.createProduto(novoProduto).subscribe(result => {
            this.router.navigate(['/gerirprodutos']);
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
