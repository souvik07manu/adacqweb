import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-addmaps',
  templateUrl: './addmaps.component.html',
  styleUrls: ['./addmaps.component.css']
})
export class AddmapsComponent implements OnInit {

  url = "http://adacq.com/API/V1/adacqappapi.php";
  kml_file: any;
  all_fields: any;
  field_name: any = 0;
  tif_img: any;
  all_maps:any;
  map_title:string;
  kml_ng:any;

  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getFields();
    this.getMaps();
  }

  async getFields() {
    await this.http.get(this.url + '?action=getfields').pipe(
      map( res => res.json())
    ).subscribe((fields) => {
      this.all_fields = fields;
    });
  }

  async getMaps() {
    await this.http.get(this.url + '?action=getmaps').pipe(
      map( res => res.json())
    ).subscribe((maps) => {
      this.all_maps = maps;
      this.spinner.hide();
    });
  }

  add_maps_modal_open() {
    $("#add_maps_modal").modal("show");
  }

   upload_kml(event) {
    this.kml_file = event.target.files[0];
    console.log(this.kml_file);
  }

  openKmlFile(){
    let element: HTMLElement = document.querySelector('#kml_pop') as HTMLElement;
    element.click();
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
    this.tif_img = reader.result;
    console.log(this.tif_img);
    
  }

  async addMaps() {
    this.spinner.show();
    let encodedPath = encodeURI(this.url);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let formData = new FormData();
    formData.append("action", "parseKML");
    formData.append("mtitle",this.map_title);
    formData.append("f_id", this.field_name);
    formData.append("tif_img", this.tif_img);
    formData.append("kml_data", this.kml_file);

    
    
      await this.http.post(encodedPath, formData)
      .pipe(map(res => res.json())).subscribe(data => {
        this.kml_file = '';
        $("#add_maps_modal").modal("hide");
        this.spinner.hide();
        if(data.msg == 'added') {
          this.kml_file = '';
          this.map_title = '';
          this.kml_ng = '';
          this.toastr.success(data.msg);
          this.getMaps();
        } else {
          this.toastr.error(data.msg);
        }
        
        
      },
      err => {
        
      });
  }

  deleteMapData(fid){
    if(confirm("Are you sure to delete?")) {
      this.http.get(this.url + '?action=removedatafrommap&m_id='+fid).pipe(
        map( res => res.json())
      ).subscribe((del) => {
        this.getMaps();
        this.toastr.success(del.msg);
      });
    }

    
  }

}
