import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {Router} from '@angular/router';
import {ServicoslistService} from '../servicoslist.service';
import {AutenticacaoService} from '../autenticacao.service';
import {ProdutoslistService} from '../produtoslist.service';
import {Produto} from '../Produto';

@Component({
  selector: 'app-gestaoprodutos',
  templateUrl: './gestaoprodutos.component.html',
  styleUrls: ['./gestaoprodutos.component.css']
})
export class GestaoprodutosComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  produtosList: Produto[] = [];

  constructor(private router: Router, private produtoslistService: ProdutoslistService, private autenticacaoService: AutenticacaoService) {
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
    this.produtosList = [];
    this.getProdutos('http://rafaelfbaptista.pythonanywhere.com/rest/listaProdutos?page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=-1');

  }



  getProdutos(url) {

    this.produtoslistService.getListaProdutos(url).subscribe(response2 => {
        response2.results.forEach((element) => {
          //@ts-ignore
          if (element.dono === this.userId) {
            this.produtosList.push(element);
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

  remover(produto: Produto): void {
    this.produtoslistService.dropProduto(produto.id).subscribe(result => {this.ngOnInit();},
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
