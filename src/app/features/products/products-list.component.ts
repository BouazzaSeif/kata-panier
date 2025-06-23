/**
 * Component for displaying a list of products, with filtering and sorting capabilities.
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ProductsApiService } from '../../core/services/products-api.service';
import { AppStoreService } from '../../shared/store/app-store.service';
import { Product } from './models';
import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  _store = inject(AppStoreService);
  /* Current selected category filter */
  selectedCategory = signal<string>('All');
  /* List of all products from store */
  products = computed<Product[]>(() => this._store.$products());
  /* List of unique categories including 'All' */
  categories = computed(() => {
    const availableCategories = Array.from(
      new Set(this.products().map((p) => p.category))
    );
    return ['All', ...availableCategories];
  });
  /* Products filtered by selected category */
  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    return cat !== 'All'
      ? this.products().filter((p) => p.category === cat)
      : this.products();
  });

  /**
   * Updates the selected category filter
   */
  filterByCategory(category: string) {
    this.selectedCategory.set(category);
  }

  /**
   * Checks if the given category is currently selected
   */
  isActiveCategory(category: string): boolean {
    return this.selectedCategory() === category;
  }
}
