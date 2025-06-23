/**
 * Header component for the application, including navigation and cart counter.
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartCounterComponent } from '../cart-counter/cart-counter.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [CartCounterComponent, RouterLink],
})
export class AppHeaderComponent {}
