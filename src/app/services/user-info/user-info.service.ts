import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getDriverId() {
    return localStorage.getItem('driver_id');
  }
  getUserObject() {
    return localStorage.getItem('userObj');
  }
}

