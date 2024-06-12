import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public companiesDatas: Array<GetCompaniesResponse> = [];
  public selectedCompany: Array<{ nome: string; code: string }> = [];
  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];
  public addProductForm = this.formBuilder.group({
    nome: ['', Validators.required],
    valor: ['', Validators.required],
    descricao: ['', Validators.required],
    empresa: ['', Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    nome: ['', Validators.required],
    valor: [0, Validators.required],
    descricao: ['', Validators.required],
  });
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private companiesService: CompaniesService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;

    console.log(this.productAction?.event?.action)
    console.log(this.editProductAction)
    console.log(this.productAction?.productDatas)

    if (
      this.productAction?.event?.action === this.editProductAction &&
      this.productAction?.productDatas
    ) {
      this.getProductSelectedDatas(this.productAction?.event?.id as string);
    }

    this.productAction?.event?.action === this.saleProductAction &&
      this.getProductDatas();

    this.getAllCompanies();
  }

  getAllCompanies(): void {
    this.companiesService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.companiesDatas = response;
            console.log(this.companiesDatas)
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        nome: this.addProductForm.value.nome as string,
        valor: Number(this.addProductForm.value.valor),
        descricao: this.addProductForm.value.descricao as string,
        empresa: this.addProductForm.value.empresa as string
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        nome: this.editProductForm.value.nome as string,
        valor: this.editProductForm.value.valor as number,
        descricao: this.editProductForm.value.descricao as string,
      };

      this.productsService
        .editProduct(requestEditProduct, this.productAction?.event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas;

    console.log(allProducts)

    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?._id === productId
      );

      console.log(productFiltered)
      console.log(productId)

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        console.log(this.productSelectedDatas)

        this.editProductForm.setValue({
          nome: this.productSelectedDatas?.nome,
          valor: this.productSelectedDatas?.valor,
          descricao: this.productSelectedDatas?.descricao,
        });
      }
    }
  }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
