/**
 * Footer component for the application, typically containing copyright.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `<footer
    class="w-full flex justify-content-center align-items-center footer"
    role="contentinfo"
  >
    <p>Seifeddine BOUAZZA © 2025 Kata Panier</p>
  </footer> `,
  styles: [
    `
      .footer {
        background: linear-gradient(90deg, #eeeeef 0%, #4280c5  100%);
        padding: 0.2rem;
        text-align: center;
        width: 100%;
        position: fixed;
        bottom: 0;
      }
    `,
  ],
})
export class AppFooterComponent {}
