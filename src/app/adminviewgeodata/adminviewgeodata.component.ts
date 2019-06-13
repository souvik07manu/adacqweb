import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-adminviewgeodata',
  templateUrl: './adminviewgeodata.component.html',
  styleUrls: ['./adminviewgeodata.component.css']
})
export class AdminviewgeodataComponent implements OnInit {

  url = "http://adacq.com/API/V1/adacqappapi.php";
  changeUserbtn: boolean = false;
  imageSrc: string = '';
  f_content: string;
  f_title: string;
  all_fields: any;
  all_maps:any;

  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.clientViewGeoData();
  }

  async clientViewGeoData(){
    await this.http.get(this.url + '?action=clientViewGeoData&clientId=1').pipe(
      map( res => res.json())
    ).subscribe((maps) => {
      this.all_maps = maps;
      this.spinner.hide();
    });
  
  }

}
