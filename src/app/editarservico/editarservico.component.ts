import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {Instituto} from '../Instituto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriasService} from '../categorias.service';
import {AutenticacaoService} from '../autenticacao.service';
import {InstitutoslistService} from '../institutoslist.service';
import {ServicoslistService} from '../servicoslist.service';
import {CategoriaServico} from '../CategoriaServico';

@Component({
  selector: 'app-editarservico',
  templateUrl: './editarservico.component.html',
  styleUrls: ['./editarservico.component.css']
})
export class EditarservicoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;
  servicoID: number;
  servico: Servico;
  categorias: CategoriaServico[] = [];
  institutos: Instituto[] = [];
  selectedCategoria: number;
  selectedInstitutos: number[] = [];

  formReady: boolean;
  formGroup: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private categoriasService: CategoriasService, private autenticacaoService: AutenticacaoService, private servicoslistService: ServicoslistService, private institutoslistService: InstitutoslistService) {
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
    this.servicoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.servicoslistService.getServicoById(this.servicoID).subscribe(result => {this.servico = result;
      //@ts-ignore
      this.selectedCategoria = this.servico.categoria;
      //@ts-ignore
      this.selectedInstitutos = this.servico.instituto;
      this.initForm();
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
    this.categoriasService.getListaCategoriasServicos().subscribe(lista => {this.categorias = lista;},
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
      });
    this.formGroup = new FormGroup({
      nome: new FormControl(this.servico.nome, [Validators.required]),
      descricao: new FormControl(this.servico.descricao, [Validators.required]),
      preco: new FormControl(this.servico.preco, [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      instituto: new FormControl('', [Validators.required]),
      foto: new FormControl(this.servico.foto, [Validators.required]),
    });
    this.formReady = true;
  }

  editarProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      this.servico.nome = this.formGroup.controls.nome.value;
      this.servico.descricao = this.formGroup.controls.descricao.value;
      this.servico.preco = this.formGroup.controls.preco.value;
      this.servico.categoria = this.formGroup.controls.categoria.value;
      this.servico.instituto =  this.formGroup.controls.instituto.value;
      this.servico.foto =  this.formGroup.controls.foto.value;
      this.servicoslistService.updateServico(this.servico).subscribe(result => {this.router.navigate(['/gerirservicos']);},
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