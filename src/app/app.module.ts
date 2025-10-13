import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NotificationComponent } from './shared/notification/notification.component';

// Componentes de páginas informativas
import { HomeComponent } from './pages/home/home.component';
import { DescripcionComponent } from './pages/descripcion/descripcion.component';
import { ObjetivosComponent } from './pages/objetivos/objetivos.component';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { CaracteristicasComponent } from './pages/caracteristicas/caracteristicas.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { SoporteComponent } from './pages/soporte/soporte.component';

// Componentes de funcionalidad
import { LoanRequestComponent } from './pages/loan-request/loan-request.component';
import { MyLoansComponent } from './pages/my-loans/my-loans.component';
import { AdminComponent } from './pages/admin/admin.component';

// Servicios
import { WalletService } from './services/wallet.service';
import { LoanService } from './services/loan/loan.service';
import { ContractService } from './services/contract/contract.service';
import { NotificationService } from './services/notification/notification.service';

// Definir rutas
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'descripcion', component: DescripcionComponent },
  { path: 'objetivos', component: ObjetivosComponent },
  { path: 'beneficios', component: BeneficiosComponent },
  { path: 'caracteristicas', component: CaracteristicasComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'soporte', component: SoporteComponent },
  { path: 'solicitar-prestamo', component: LoanRequestComponent },
  { path: 'mis-prestamos', component: MyLoansComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' } // Ruta comodín
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotificationComponent,
    HomeComponent,
    DescripcionComponent,
    ObjetivosComponent,
    BeneficiosComponent,
    CaracteristicasComponent,
    EquipoComponent,
    SoporteComponent,
    LoanRequestComponent,
    MyLoansComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    WalletService,
    LoanService,
    ContractService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}