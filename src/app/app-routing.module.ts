import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: 'shell', loadChildren: () => import("./shell/shell.module").then(m => m.ShellModule) }, 
  { path: "**", redirectTo: "shell" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
