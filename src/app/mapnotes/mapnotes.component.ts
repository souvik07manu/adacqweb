import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


declare var google:any;
declare var $: any;

@Component({
  selector: 'app-mapnotes',
  templateUrl: './mapnotes.component.html',
  styleUrls: ['./mapnotes.component.css']
})
export class MapnotesComponent implements OnInit {
  @ViewChild('map') mapRef:ElementRef;
  @ViewChild('content') content:ElementRef;
  url = "http://adacq.com/API/V1/adacqappapi.php";
  markerIcon: any;
  marker_id: number;
  note: any;
  select_user: any;
  all_users: any;
  allNotes: any;
  imageSrc: string = '';
  addnoteBtn: boolean = false;
  field_id: number;
  d_lat: any;
  d_long: any;
  done_btn:boolean=false;
  mapid:number;
  add_note_btn:boolean=false;
  marker_status:string;
  mark_stat:any;
  locationKey:any;
  locationName:any;
  lat:any;
  long:any;
  currentWeather:any;
  foreCasts:any;


  constructor(
    private http: Http,
    private ngZone: NgZone,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toast: ToastrService,
  ) {
    
   }

  ngOnInit() {
    this.field_id=this.route.snapshot.params['field_id'];
    // get default map lat and long
    this.http.get(this.url + '?action=getmapbounds&f_id='+this.field_id).pipe(
      map( res => res.json())
    ).subscribe((bounds) => {
      this.mapid=bounds[0].m_id;
      this.d_lat = bounds[0].m_north;
      this.d_long=bounds[0].m_west;
      this.getLocationKey(this.d_lat,this.d_long);
    });
    // get all users to choose from modal
    this.http.get(this.url + '?action=getallusers').pipe(
      map( res => res.json())
    ).subscribe((users) => {
      this.all_users = users;
      $("#exampleModalCenterallusers").modal('show');
    });

    
  }

  openAddNoteModal() {
    this.content.nativeElement.click();
  }

  async DisplayMap(userid) {
    //  store choose user to the local storage
    localStorage.setItem('ada_choose_useridkey', userid);

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
      
      

      
      // get markers list
      await this.http.get(this.url + '?action=getmarkers&map_id='+this.mapid+'&user_id='+userid).pipe(
        map( res => res.json())
      ).subscribe((locationss) => {
        // marker placed
        for (i = 0; i < locationss.length; i++) {
          let markerID = locationss[i]['mark_id'];
          if(locationss[i]['mark_status'] == 'red') {
             this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          } else if(locationss[i]['mark_status'] == 'yellow') {
            this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
          } else {
            this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
          }
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locationss[i]['mark_lat'],locationss[i]['mark_long']),
            map: mapp,
            icon: this.markerIcon
          });

          // click on the marker 
          //const infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', (event) => {
            //alert(markerID);
            this.ngZone.run(() => {
              this.add_note_btn=true;
              $("#hd_marker_id").val(markerID);
              this.viewNotes(userid);
              this.getMarkerStatus();
              
              //infowindow.setContent('Opened');
              //infowindow.open(mapp, marker);
              //this.addnoteBtn = true;
              
              //this.router.navigate(['']);
            });
          });
        }
      });

      // ground overlay from api//////
      await this.http.get(this.url + '?action=getmapbounds&f_id='+this.field_id).pipe(
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

  async addNote() {
    this.spinner.show();
    // get selected user from local storage
    let selected_user_id = localStorage.getItem('ada_choose_useridkey');
    let marker_id = $("#hd_marker_id").val();
    console.log(marker_id);
      let encodedPath = encodeURI(this.url);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let formData = new FormData();
      formData.append("action", "addnoteadmin");
      formData.append("user_id", selected_user_id);
      formData.append("note_id", marker_id);
      formData.append("noteTxt", this.note);
      formData.append("img_data", this.imageSrc);
      
        this.http.post(encodedPath, formData)
        .pipe(map(res => res.json())).subscribe(data => {
          this.note = '';
          $("#exampleModalCenter").modal("hide");
          this.spinner.hide();
          this.viewNotes(selected_user_id);
        },
        err => {
          
        });
    
  }

  async viewNotes(userid) {
    this.spinner.show();
    let marker_id = $("#hd_marker_id").val();
    await this.http.get(this.url + '?action=getnotes&admin_user_id=0&note_id='+marker_id+'&user_id='+userid).pipe(
      map( res => res.json())
    ).subscribe((allnotes) => {
      this.spinner.hide();
      $("#exampleModalCenterallusers").modal('hide');
      this.allNotes = allnotes;
    });
  }



  /////click map////////

  async editmap() {
    this.done_btn=true;
    let selected_user_id = localStorage.getItem('ada_choose_useridkey');
    //this.edit = false;
    // Getting current user location from GPS 
    const location = new google.maps.LatLng(this.d_lat,this.d_long);
    const options = {
      center:location,
      zoom:15,
      streetViewControl:false,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true
    };

    const mapp = new google.maps.Map(this.mapRef.nativeElement,options);
    let marker, i;

    // ground overlay from api//////
    await this.http.get(this.url + '?action=getmapbounds&f_id='+this.field_id).pipe(
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




         // get markers list
       this.http.get(this.url + '?action=getmarkers&map_id='+this.mapid+'&user_id='+selected_user_id).pipe(
        map( res => res.json())
      ).subscribe((locationss) => {
        // marker placed
        for (i = 0; i < locationss.length; i++) {
          let markerID = locationss[i]['mark_id'];
          if(locationss[i]['mark_status'] == 'red') {
            this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
         } else if(locationss[i]['mark_status'] == 'yellow') {
           this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
         } else {
           this.markerIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
         }
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locationss[i]['mark_lat'],locationss[i]['mark_long']),
            map: mapp,
            icon: this.markerIcon
          });

          
          //const infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', (event) => {
            //alert(markerID);
            this.ngZone.run(() => {
              //this.navCtrl.navigateForward('/notes/'+markerID);
            });
          });
        }
      });

    // click on the map and place marker
     google.maps.event.addListener(overlayGeoMapImg, 'click', (event: any) => {
      this.ngZone.run(() => {
        marker = new google.maps.Marker({
          position: event.latLng,
          map: mapp,
        });
        this.http.get(this.url + '?action=addmarkers&map_id='+this.mapid+'&user_id='+selected_user_id+'&lat='+event.latLng.lat().toFixed(3)+'&long='+event.latLng.lng().toFixed(3)).pipe(
          map( res => res.json())
        ).subscribe((response) => {
          
        });
      });
    });


    });

     

  // click on the marker 
  //const infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', () => {
    this.ngZone.run(() => {
     // this.navCtrl.navigateForward('/notes');
    });
  });
  }

  donemap(){
    let selected_user_id = localStorage.getItem('ada_choose_useridkey');
    this.done_btn=false;
    this.DisplayMap(selected_user_id);
  }


  //////////marker status change   ////
  marker_status_change(){
   let markerid=$("#hd_marker_id").val();
   if(this.marker_status){
    this.http.get(this.url + '?action=markerStatusChange&marker_id='+markerid+'&status=green').pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.toast.show(response.msg);
     //this.DisplayMap();
    });
   } else{
    this.http.get(this.url + '?action=markerStatusChange&marker_id='+markerid+'&status=yellow').pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.toast.show(response.msg);
     //this.DisplayMap();
    });
   }
  }

  /////////get Marker Status //////
  async getMarkerStatus(){
    let markerid=$("#hd_marker_id").val();
    await this.http.get(this.url + '?action=getMarkerStatus&marker_id='+markerid).pipe(
      map( res => res.json())
    ).subscribe((response) => {
     this.mark_stat=response;
    });
  }


  //////weather forecast/////////

  async getLocationKey(lat,long) {
      this.lat = lat;
      this.long = long;

      this.http.get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=PvTtvFgP6PW4M9GAAAhYybWneLGFNtDe&q="+this.lat+","+this.long).pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.locationKey = response.Key;
      this.locationName = response.LocalizedName;
      this.getCurrentWeather();
      this.getFiveDayForecastWeather();
    });
  }

  async getCurrentWeather() {
    await this.http.get("http://dataservice.accuweather.com/currentconditions/v1/"+this.locationKey+"?apikey=PvTtvFgP6PW4M9GAAAhYybWneLGFNtDe&details=true").pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.currentWeather = response;
    });
  }

  async getFiveDayForecastWeather() {
    await this.http.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+this.locationKey+"?apikey=PvTtvFgP6PW4M9GAAAhYybWneLGFNtDe").pipe(
      map( res => res.json())
    ).subscribe((response) => {
      this.foreCasts = response.DailyForecasts;
    });
  }

  /////delete note using noteid///////////
  deleteNote(noteId){
    if(confirm("Are you sure to delete?")) {
      let selected_user_id = localStorage.getItem('ada_choose_useridkey');
      this.http.get(this.url + '?action=removeNote&n_id='+noteId).pipe(
        map( res => res.json())
      ).subscribe((delfiled) => {
        this.toast.success(delfiled.msg);
        this.viewNotes(selected_user_id);
      });
    }

  }

  

}
