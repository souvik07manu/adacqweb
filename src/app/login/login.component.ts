import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  url = "http://adacq.com/API/V1/adacqappapi.php";
  @ViewChild('content') content:ElementRef;
  email: string;
  password: string;


  constructor(
    private modalService: NgbModal,
    private http: Http,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.content.nativeElement.click();
  }

  

  async login() {
    /** spinner starts on init */
    this.spinner.show();
    /*
    setTimeout(() => {
        this.spinner.hide();
    }, 5000);
    */
    await this.http.get(this.url + '?action=login&email='+this.email+'&password='+this.password).pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.spinner.hide();
      if(response.user_id) {
        this.toastr.success('Welcome to the Adacq web panel', 'Awesome');
        this.router.navigate(['/dashboard']);
      } else{
        this.toastr.error(response.Error);
      
      }
      
    });
  }

  

}
