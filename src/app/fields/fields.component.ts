import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {

  url = "http://adacq.com/API/V1/adacqappapi.php";
  changeUserbtn: boolean = false;
  imageSrc: string = '';
  f_content: string;
  f_title: string;
  all_fields: any;


  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getFields();
  }

   async getFields() {
    
    await this.http.get(this.url + '?action=getfields').pipe(
      map( res => res.json())
    ).subscribe((fields) => {
      this.spinner.hide();
      this.all_fields = fields;
    });
  }

  async add_field_modal_open() {
    await $("#add_field_modal").modal('show');
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc);
  }

  async addField() {
    this.spinner.show();
    // get selected user from local storage
    let selected_user_id = localStorage.getItem('ada_choose_useridkey');
    //let marker_id = $("#hd_marker_id").val();
      let encodedPath = encodeURI(this.url);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let formData = new FormData();
      formData.append("action", "addfields");
      formData.append("title", this.f_title);
      formData.append("content", this.f_content);
      formData.append("img_data", this.imageSrc);
      
        await this.http.post(encodedPath, formData)
        .pipe(map(res => res.json())).subscribe(data => {
          this.f_title = '';
          this.f_content = '';
          this.imageSrc = '';
          $("#add_field_modal").modal("hide");
          this.getFields();
          this.spinner.hide();
          this.toastr.success(data.msg, 'Awesome');
          
        },
        err => {
          
        });
  }

  deleteFieldData(fieldid){
    if(confirm("Are you sure to delete?")) {
      this.http.get(this.url + '?action=removedatafromfield&f_id='+fieldid).pipe(
        map( res => res.json())
      ).subscribe((delfiled) => {
        this.toastr.success(delfiled.delmsg);
        this.getFields();
      });
    }
    
  }

}
