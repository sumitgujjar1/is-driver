import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private router:Router) {
    console.log(localStorage.getItem('loginStatus'));

    if(localStorage.getItem('loginStatus') == null) {
      this.router.navigate(['/login'])
    } else {
      this.router.navigate(['/tabs/tab1'])
    }
  }
}
