import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataService } from "./data.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material/material.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DataService]
})
export class SharedModule {}
