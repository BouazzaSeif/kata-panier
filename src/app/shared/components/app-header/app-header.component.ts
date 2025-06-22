/**
 * Header component for the application, including navigation and cart counter.
 */
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartCounterComponent } from '../cart-counter/cart-counter.component';
import { AppStoreService } from '../../store/app-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [CartCounterComponent, RouterLink],
})
export class AppHeaderComponent {}
