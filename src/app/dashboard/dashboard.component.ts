import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompileShallowModuleMetadata } from '@angular/compiler';


declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  url = "http://adacq.com/API/V1/adacqappapi.php";
  name: string;
  email: string;
  password: string;
  all_clients: any;
  clientByUsername: any;
  edit_name: string;
  edit_email: string;
  edit_passord: string;
  edit_status: any;
  total_number_clients: any;
  total_number_fields: any;
  total_number_geodata: any;
  total_number_notes: any;


  constructor(
    private http: Http,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getClient();
    this.viewAllClients();
    this.viewAllClientsField();
    this.viewAllGeoData();
    this.viewAllNotes();
    var $contextMenu = $("#contextMenu");

    $("body").on("contextmenu", "table tr td", function (e) {
      $contextMenu.css({
        display: "block",
        left: e.pageX,
        top: e.pageY
      });
      console.log(e);
      $("#hd_client_em").val(e.target.innerHTML);
      return false;
    });

    $contextMenu.on("click", "a", function () {
      $contextMenu.hide();
    });

    $("body").click( function() {
      $contextMenu.hide();
    });
  }

  addClientBtn() {
    $("#add_cilent_modal").modal("show");
  }


  async addClient() {
    this.spinner.show();
    await this.http.get(this.url + '?action=addClient&c_name=' + this.name + '&c_email=' + this.email + '&c_password=' + this.password).pipe(
      map(res => res.json())
    ).subscribe((client) => {
      this.spinner.hide();
      this.getClient();
      $("#add_cilent_modal").modal("hide");
      this.toastr.success(client.msg);

    });
  }

  async getClient() {
    await this.http.get(this.url + '?action=showClient').pipe(
      map(res => res.json())
    ).subscribe((client) => {
      this.spinner.hide();
      this.all_clients = client;

    });
  }

  ///////show modal for edit client /////////
  editClientMod(client_uname){
    $("#edit_cilent_modal").modal("show");
    //let client_uname = $("#hd_client_em").val();
    this.http.get(this.url + '?action=getClientByUsername&username=' + client_uname).pipe(
      map(res => res.json())
    ).subscribe((client) => {
     // this.clientByUsername = client;
     this.edit_name = client.c_name;
     this.edit_email = client.c_email;
     this.edit_passord = client.c_password;
     this.edit_status = client.c_status;
    });
  }

  ////////update edit client modal //////////
  updateClient(){
     this.http.get(this.url + '?action=updateClientProfile&c_name=' + this.edit_name+ '&c_email=' + this.edit_email + '&c_password=' + this.edit_passord + '&c_status=' + this.edit_status).pipe(
      map(res => res.json())
    ).subscribe((client) => {
      this.spinner.hide();
      this.getClient();
      $("#edit_cilent_modal").modal("hide");
      this.toastr.success(client.msg);

    });
  }

   ////////delete client  //////////
  deleteClient(client_email) {
    if (confirm("Are you sure to delete?")) {
      //let client_email = $("#hd_client_em").val();
      console.log(client_email);
      this.http.get(this.url + '?action=deleteClient&username=' + client_email).pipe(
        map(res => res.json())
      ).subscribe((client) => {
        this.spinner.hide();
        this.getClient();
        this.toastr.success(client.msg);
      });
    }
  }

  viewFields(){
    this.router.navigate(['/adminviewfield']);
  }
  viewGeoData(){
    this.router.navigate(['/adminviewgeodata']);
  }


  ///////All client /////
  viewAllClients(){
     this.http.get(this.url + '?action=totalNumberOfClientsDashboard').pipe(
      map(res => res.json())
    ).subscribe((totalNumberOfClients) => {
      this.spinner.hide();
      this.total_number_clients = totalNumberOfClients;

    });
  }

  ///////All Fields /////
  viewAllClientsField(){
    this.http.get(this.url + '?action=totalNumberOfFieldsDashboard').pipe(
     map(res => res.json())
   ).subscribe((totalNumberOfFileds) => {
     this.spinner.hide();
     this.total_number_fields = totalNumberOfFileds;

   });
 }

 ///////All Geo Data /////

 viewAllGeoData(){
  this.http.get(this.url + '?action=totalNumberOfGeoDataDashboard').pipe(
    map(res => res.json())
  ).subscribe((totalNumberOfGeoData) => {
    this.spinner.hide();
    this.total_number_geodata = totalNumberOfGeoData;
  });
 }

 ///////All Notes /////
 viewAllNotes(){
  this.http.get(this.url + '?action=totalNumberOfNotesDashboard').pipe(
    map(res => res.json())
  ).subscribe((totalNumberOfNotes) => {
    this.spinner.hide();
    this.total_number_notes = totalNumberOfNotes;
  });
 }




}
