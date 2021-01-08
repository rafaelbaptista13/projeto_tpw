import { Injectable } from '@angular/core';
import {Servico} from './Servico';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CategoriaServico} from './CategoriaServico';
import {Instituto} from './Instituto';
import {Produto} from './Produto';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ServicoslistService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) { }

  getListaServicos(nomePesquisado: string, institutoPesquisado: number, categoriaPesquisada: number, minpricePesquisado: string, maxpricePesquisado: string): Observable<Servico[]> {
    let url = this.baseUrl + 'listaServicos?';
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

    return this.http.get<Servico[]>(url);
  }


  getServicoById(id: number) {
    let url = this.baseUrl + 'servico?';
    url += '&id=' + id;
    return this.http.get<Servico>(url)
  }

  getVendedoresDeServico(id: number) {
    let url = this.baseUrl + 'vendedoresservico?';
    url += '&id=' + id;
    return this.http.get<Instituto[]>(url)
  }

  createServico(servico: Servico): Observable<any> {
    let url = this.baseUrl + 'createServico';
    return this.http.post(url, servico, httpOptions);
  }

  updateServico(servico: Servico): Observable<any> {
    let url = this.baseUrl + 'updateServico';
    return this.http.put(url, servico, httpOptions);
  }

  dropServico(id: number) {
    let url = this.baseUrl + 'dropServico/' + id;
    return this.http.delete(url, httpOptions);
  }
}
