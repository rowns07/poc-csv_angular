import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TutorialModel } from '../models/tutorial-model';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  list(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/csv/tutorials')
  }

  newItem(item: TutorialModel):Observable<TutorialModel> {
    console.log("item:", item);
    return this.http.post<TutorialModel>(environment.apiUrl + '/api/csv/tutorial', item);
  }
}
