import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
})
export class ToolbarNavigationComponent {
  constructor(private cookie: CookieService, private router: Router, private productsDtService: ProductsDataTransferService,) {}

  handleLogout(): void {
    this.cookie.delete('USER_INFO');
    this.cookie.delete('USER_ID');
    this.productsDtService.resetProductsDatas();
    void this.router.navigate(['/home']);
  }
}
