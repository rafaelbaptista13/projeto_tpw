import { Injectable } from '@angular/core';
import {Produto} from './Produto';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CategoriaProduto} from './CategoriaProduto';
import {Instituto} from './Instituto';
import {Servico} from './Servico';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProdutoslistService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) { }

  getListaProdutos(nomePesquisado: string, institutoPesquisado: number, categoriaPesquisada: number, minpricePesquisado: string, maxpricePesquisado: string): Observable<Produto[]> {
    let url = this.baseUrl + 'listaProdutos?';
    if (nomePesquisado === undefined ) {
      nomePesquisado = '';
    }
    url += '&nome=' + nomePesquisado;

    if (institutoPesquisado === undefined) {
      institutoPesquisado = -1;
    }
    url += '&instituto=' + institutoPesquisado;

    if (categoriaPesquisada === undefined) {
      categoriaPesquisada = -1;
    }
    url += '&categoria=' + categoriaPesquisada;

    if (minpricePesquisado === undefined) {
      minpricePesquisado = '';
    }
    url += '&minprice=' + minpricePesquisado;

    if (maxpricePesquisado === undefined) {
      maxpricePesquisado = '';
    }
    url += '&maxprice=' + maxpricePesquisado;

    return this.http.get<Produto[]>(url);
  }

  getProdutoById(id: number) {
    let url = this.baseUrl + 'produto?';
    url += '&id=' + id;
    return this.http.get<Produto>(url)
  }

  getVendedoresDeProduto(id: number) {
    let url = this.baseUrl + 'vendedoresproduto?';
    url += '&id=' + id;
    return this.http.get<Instituto[]>(url)
  }


  createProduto(produto: Produto): Observable<any> {
    let url = this.baseUrl + 'createProduto';
    return this.http.post(url, produto, httpOptions);
  }

  updateProduto(produto: Produto): Observable<any> {
    let url = this.baseUrl + 'updateProduto';
    return this.http.put(url, produto, httpOptions);
  }

  dropProduto(id: number) {
    let url = this.baseUrl + 'dropProduto/' + id;
    return this.http.delete(url, httpOptions);
  }
}
