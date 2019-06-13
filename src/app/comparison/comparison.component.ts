import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var google:any;

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {

  @ViewChild('map') mapRef:ElementRef;
  @ViewChild('map_sec') map_sec:ElementRef;
  

  url = "http://adacq.com/API/V1/adacqappapi.php";
  changeUserbtn: boolean = false;
  imageSrc: string = '';
  f_content: string;
  f_id_com: any;
  all_com_fields: any;
  filterItems: any;
  checkbox_field_id = [];
  all_com_fields_but: any;

  //////
  d_lat: any;
  d_long: any;
  markerIcon: any;
  mapid:number;

  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,

    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getComparisonField();
    //this.startComparisonBtn();
    
  }

  ////////open comparison modal ///
  async add_comparison_modal_open() {
    await $("#add_comparison_modal").modal('show');
  }

  async getComparisonField() {
    
    await this.http.get(this.url + '?action=getfields').pipe(
      map( res => res.json())
    ).subscribe((comFields) => {
      this.spinner.hide();
      this.all_com_fields = comFields;
    });
  }

 async startComparisonBtn(){
  await this.http.get(this.url + '?action=comparisonMap&f_ids='+this.checkbox_field_id).pipe(
      map( res => res.json())
    ).subscribe((comFields) => {
      $("#add_comparison_modal").modal('hide');
      this.spinner.hide();
      console.log(this.checkbox_field_id);
  // get default map lat and long
  let checkbox_field_id_arr2str: any ;
   checkbox_field_id_arr2str = this.checkbox_field_id.toString() ;
   checkbox_field_id_arr2str = checkbox_field_id_arr2str.split(",");

   this.http.get(this.url + '?action=getmapbounds&f_id='+checkbox_field_id_arr2str[0]).pipe(
    map( res => res.json())
  ).subscribe((bounds) => {
    this.mapid=bounds[0].m_id;
    this.d_lat = bounds[0].m_north;
    this.d_long=bounds[0].m_west;
  // this.getLocationKey(this.d_lat,this.d_long);
  });
  

   this.DisplayMap(checkbox_field_id_arr2str[0]);
   this.DisplayMapTwo(checkbox_field_id_arr2str[1]);
      this.all_com_fields_but = comFields;
    });
   
    
  }

  ///checkbox check func event ///////
  updateSelectedTimeslots(event) {
    if (event.target.checked) {
          this.checkbox_field_id.push(event.target.name);
     } else {
      const index: number = this.checkbox_field_id.indexOf(event.target.name);
    if (index !== -1) {
        this.checkbox_field_id.splice(index, 1);
    }  
 
    }
     ////split  array to string //////////    
     this.checkbox_field_id.join(",");
}

/////////////display map ///////////

async DisplayMap(field_id) {
  //  store choose user to the local storage
  //localStorage.setItem('ada_choose_useridkey', userid);

  // Getting current user location from GPS 
    const location = new google.maps.LatLng(this.d_lat,this.d_long);
    //const location2 = new google.maps.LatLng('40.7128','-74.0060');
    const options = {
      center:location,
      zoom:15,
      streetViewControl:false,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true
    };

    const mapp = await new google.maps.Map(this.mapRef.nativeElement,options);
    let marker, i;
    let infowindow = new google.maps.InfoWindow();

    // loggedin user current location
    // watch current position of the user
    
    

    
    

    // ground overlay from api//////
    await this.http.get(this.url + '?action=getmapbounds&f_id='+field_id).pipe(
      map( res => res.json())
    ).subscribe((bounds) => {
      
      var imageBounds = {
        north: parseFloat(bounds[0].m_north),
        south: parseFloat(bounds[0].m_south),
        east: parseFloat(bounds[0].m_east),
        west: parseFloat(bounds[0].m_west) 
      };
  
      
      let overlayGeoMapImg = new google.maps.GroundOverlay(
        bounds[0].m_image_url,
        imageBounds);
        overlayGeoMapImg.setMap(mapp);
        $("#exampleModalCenterallusers").modal('hide');
    });

  
    
}


/////////////display map 2 ////////////

async DisplayMapTwo(field_id) {
  //  store choose user to the local storage
  //localStorage.setItem('ada_choose_useridkey', userid);

  // Getting current user location from GPS 
    const location = new google.maps.LatLng(this.d_lat,this.d_long);
    //const location2 = new google.maps.LatLng('40.7128','-74.0060');
    const options = {
      center:location,
      zoom:15,
      streetViewControl:false,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true
    };

    const mapp = await new google.maps.Map(this.map_sec.nativeElement,options);
    let marker, i;
    let infowindow = new google.maps.InfoWindow();

    // loggedin user current location
    // watch current position of the user
    
    

    
    

    // ground overlay from api//////
    await this.http.get(this.url + '?action=getmapbounds&f_id='+field_id).pipe(
      map( res => res.json())
    ).subscribe((bounds) => {
      
      var imageBounds = {
        north: parseFloat(bounds[0].m_north),
        south: parseFloat(bounds[0].m_south),
        east: parseFloat(bounds[0].m_east),
        west: parseFloat(bounds[0].m_west) 
      };
  
      
      let overlayGeoMapImg = new google.maps.GroundOverlay(
        bounds[0].m_image_url,
        imageBounds);
        overlayGeoMapImg.setMap(mapp);
        $("#exampleModalCenterallusers").modal('hide');
    });

  
    
}

}
