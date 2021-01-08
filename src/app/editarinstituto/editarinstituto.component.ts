import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {InstitutoslistService} from '../institutoslist.service';
import {Instituto} from '../Instituto';
import {Produto} from '../Produto';
import {Servico} from '../Servico';
import {ServicoslistService} from '../servicoslist.service';
import {ProdutoslistService} from '../produtoslist.service';
import {StafflistService} from '../stafflist.service';
import {MembroStaff} from '../MembroStaff';

@Component({
  selector: 'app-editarinstituto',
  templateUrl: './editarinstituto.component.html',
  styleUrls: ['./editarinstituto.component.css']
})
export class EditarinstitutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;
  institutoID: number;
  instituto: Instituto;
  servicolist: Servico[] = [];
  produtolist: Produto[] = [];
  membrosList: MembroStaff[];
  staffDict = {};
  trabalhosDict = {};


  formReady: boolean;
  formGroup: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private autenticacaoService: AutenticacaoService, private institutoslistService: InstitutoslistService, private servicoslistService: ServicoslistService, private produtoslistService: ProdutoslistService, private staffService: StafflistService) {
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
    this.staffDict = {};
    this.trabalhosDict = {};
    this.membrosList = [];
    this.institutoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.institutoslistService.getInstitutoById(this.institutoID).subscribe(result => {
      this.instituto = result;
      this.servicoslistService.getListaServicos('', this.institutoID, -1, '', '').subscribe(result1 => this.servicolist = result1,
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
      this.produtoslistService.getListaProdutos('', this.institutoID, -1, '', '').subscribe(result2 => this.produtolist = result2,
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
      this.initForm();
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.staffService.getListaStaffByInstitutoID(this.institutoID).subscribe(result1 => { this.membrosList = result1;
      this.membrosList.forEach( (element) => {
        //@ts-ignore
        this.staffService.getListaTrabalhos(this.institutoID, element.id).subscribe(result2 => {this.staffDict[element.id] = element; this.trabalhosDict[element.id] = result2;},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          })
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
    console.log(this.instituto)
    this.formGroup = new FormGroup({
      nome: new FormControl(this.instituto.nome, [Validators.required]),
      slogan: new FormControl(this.instituto.slogan, [Validators.required]),
      localizacao: new FormControl(this.instituto.localizacao, [Validators.required]),
      email: new FormControl(this.instituto.email, [Validators.required]),
      website: new FormControl(this.instituto.website, [Validators.required]),
      foto: new FormControl(this.instituto.foto, [Validators.required]),
    });
    this.formReady = true;
  }

  editarProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      this.instituto.nome = this.formGroup.controls.nome.value;
      this.instituto.slogan = this.formGroup.controls.slogan.value;
      this.instituto.localizacao = this.formGroup.controls.localizacao.value;
      this.instituto.email = this.formGroup.controls.email.value;
      this.instituto.website = this.formGroup.controls.website.value;
      this.instituto.foto =  this.formGroup.controls.foto.value;
      this.institutoslistService.updateInstituto(this.instituto).subscribe(result => {  this.router.navigate(['/geririnstitutos']);},
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




  removerServico(servico: Servico) {
    this.servicoslistService.dropServico(servico.id).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  removerProduto(produto: Produto) {
    this.produtoslistService.dropProduto(produto.id).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  removerStaff(membrostaff: MembroStaff): void {
    this.staffService.dropMembroStaff(membrostaff.id).subscribe(result => {this.ngOnInit();},
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
