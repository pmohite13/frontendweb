import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShellComponent } from "./shell.component";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./components/main/main.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material/material.module";
import { ProductHomeComponent } from './components/product/product-home/product-home.component';
import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { ProductEditComponent } from './components/product/product-edit/product-edit.component';


const routes: Routes = [
  {
    path: '', component: ShellComponent,
    children: [     
      { path: 'addproduct', component: ProductCreateComponent },
      { path: 'editproduct/:id', component: ProductEditComponent },
      { path: 'listproduct', component: ProductHomeComponent },
      { path: 'main', component: MainComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [ShellComponent, MainComponent, ProductHomeComponent, ProductCreateComponent, ProductEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule
  ]
})
export class ShellModule { }
