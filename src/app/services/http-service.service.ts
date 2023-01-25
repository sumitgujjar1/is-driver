import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  httpOptions: any = {
    headers:{
      //'Content-Type': 'application/json',
      // 'Authorization': ''  ,
      // 'username':'',
      // 'hub_store':''   
    }
    
  }
  constructor(
    private httpClient: HttpClient,
  ) { }

  handleError(error: HttpErrorResponse) {
    console.log('handle',error);
    
    let errorObj = {
      status:false,
      msg: ''
    };
    if(error.error instanceof ErrorEvent) {
      console.log('client');
      
      errorObj.msg = error.error.message; //Client Side Errors
    } else { 
      console.log('server');
      errorObj.msg = error.error.message; 
    }  
    
    return throwError(errorObj)
  }
   
  public request(endpoint: string , payload: Object = {},method:string = 'POST'){
    this.httpOptions['body'] = payload;
    return this.httpClient.request(method,'https://api-drivers.instaswap.in/' + endpoint,this.httpOptions).pipe(catchError(this.handleError.bind(this)));
  }
}
