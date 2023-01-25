import { Component, OnInit  ,ViewChild, ElementRef,Input} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.page.html',
  styleUrls: ['./mapview.page.scss'],
})
export class MapviewPage implements OnInit {
  @Input("lat") lat;
  @Input("long") long;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
 }
 marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
 }
  latitude: number;
  longitude: number;
  userIcon:any;
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    let userObject = JSON.parse(localStorage.getItem('userObj'));
    this.userIcon = userObject.profile_pic;
    if(this.userIcon == null) {
      this.userIcon = '../../assets/tuk-tuk.svg';
    }
    console.log(this.lat,this.long);
    this.loadMap(this.lat,this.long);
  }
// map code starts here
loadMap(lat,long) {
  this.latitude = parseInt(lat);
  this.longitude = parseInt(long);

  let latLng = new google.maps.LatLng(lat,long);
   this.mapOptions = {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.marker.position = {
    lat:lat,
    lng:long
  }

  // this.getAddressFromCoords(lat,long);

  // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  // this.map.addListener('dragend', () => {

  //   this.latitude = this.map.center.lat();
  //   this.longitude = this.map.center.lng();
  // });
  //   this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
  // });
  
  // this.geolocation.getCurrentPosition().then((resp) => {

  //   this.latitude = lat;
  //   this.longitude = long;

  //   let latLng = new google.maps.LatLng(lat,long);
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 16,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }

  //   this.getAddressFromCoords(lat,long);

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //   this.map.addListener('dragend', () => {

  //     this.latitude = this.map.center.lat();
  //     this.longitude = this.map.center.lng();

  //     this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
  //   });

  // }).catch((error) => {
  //   console.log('Error getting location', error);
  // });
}

getAddressFromCoords(lattitude, longitude) {
  console.log("getAddressFromCoords " + lattitude + " " + longitude);
  let options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
    .then((result: NativeGeocoderResult[]) => {
      this.address = "";
      let responseAddress = [];
      for (let [key, value] of Object.entries(result[0])) {
        if (value.length > 0)
          responseAddress.push(value);

      }
      responseAddress.reverse();
      for (let value of responseAddress) {
        this.address += value + ", ";
      }
      this.address = this.address.slice(0, -2);
    })
    .catch((error: any) => {
      this.address = "Address Not Available!";
    });

}

dismiss() {
  // using the injected ModalController this page
  // can "dismiss" itself and optionally pass back data
  this.modalCtrl.dismiss({
    'dismissed': true
  });
}
}
