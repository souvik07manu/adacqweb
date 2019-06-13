import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-adminviewfields',
  templateUrl: './adminviewfields.component.html',
  styleUrls: ['./adminviewfields.component.css']
})
export class AdminviewfieldsComponent implements OnInit {

  url = "http://adacq.com/API/V1/adacqappapi.php";
  changeUserbtn: boolean = false;
  imageSrc: string = '';
  f_content: string;
  f_title: string;
  all_fields: any;
  clientId: number = 1;

  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.clientViewFields(this.clientId);
  }

  async clientViewFields(clientId){

    await this.http.get(this.url + '?action=clientViewFields&clientId=1').pipe(
      map( res => res.json())
    ).subscribe((fields) => {
      console.log(fields);
      this.spinner.hide();
      this.all_fields = fields;
    });

  }
}
