import { Component } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LodgingCardComponent } from 'src/app/lodgings/components/lodging-card/lodging-card.component';
import {
  Lodging,
  LodgingType,
  PriceUnit,
} from 'src/app/lodgings/models/lodging.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    LodgingCardComponent,
  ],
})
export class HomePage {
  readonly lodgings: Lodging[] = [
    {
      id: 'placeholder-1',
      title: 'Cabana frente al mar',
      description: 'Placeholder Home',
      location: 'Paseo 111 y Playa',
      city: 'Villa Gesell',
      type: LodgingType.CABIN,
      price: 85000,
      priceUnit: PriceUnit.NIGHT,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      minNights: 2,
      amenities: [],
      mainImage: '',
      images: [],
    },
    {
      id: 'placeholder-2',
      title: 'Departamento bosque',
      description: 'Placeholder Home',
      location: 'Alameda 203',
      city: 'Mar de las Pampas',
      type: LodgingType.APARTMENT,
      price: 94000,
      priceUnit: PriceUnit.NIGHT,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 2,
      minNights: 3,
      amenities: [],
      mainImage: '',
      images: [],
    },
  ];
}
