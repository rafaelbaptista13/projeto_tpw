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
  private baseUrl = 'http://rafaelfbaptista.pythonanywhere.com/rest/';

  constructor(private http: HttpClient) { }

  getListaServicos(url: string): Observable<any> {

    return this.http.get<any>(url);
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
