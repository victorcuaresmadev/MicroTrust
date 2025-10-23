import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

// Componentes de autenticación
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/login/login.component';

// Layouts
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';

// Componentes compartidos
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { TransactionViewerComponent } from './shared/transaction-viewer/transaction-viewer.component';

// Componentes de dashboard
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

// Componente de verificación
import { StudentVerificationComponent } from './pages/student-verification/student-verification.component';

// Servicios
import { WalletService } from './services/wallet.service';
import { LoanService } from './services/loan/loan.service';
import { ContractService } from './services/contract/contract.service';
import { NotificationService } from './services/notification/notification.service';
import { ThemeService } from './services/theme/theme.service';
import { BlockchainExplorerService } from './services/blockchain-explorer.service';
import { StudentVerificationService } from './services/student-verification.service';

// Guards
import { AdminGuard } from './guards/admin.guard';
import { ClientGuard } from './guards/client.guard';
import { AuthGuard } from './guards/auth.guard';

// Definir rutas
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verificacion-estudiante', component: StudentVerificationComponent },
  
  // Rutas públicas de la landing page (para visitantes sin conectar)
  { path: 'home', component: HomeComponent },
  { path: 'descripcion', component: DescripcionComponent },
  { path: 'objetivos', component: ObjetivosComponent },
  { path: 'beneficios', component: BeneficiosComponent },
  { path: 'caracteristicas', component: CaracteristicasComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'soporte', component: SoporteComponent },
  
  // Rutas para el área de cliente
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard, ClientGuard],
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'home', component: HomeComponent },
      { path: 'descripcion', component: DescripcionComponent },
      { path: 'objetivos', component: ObjetivosComponent },
      { path: 'beneficios', component: BeneficiosComponent },
      { path: 'caracteristicas', component: CaracteristicasComponent },
      { path: 'equipo', component: EquipoComponent },
      { path: 'soporte', component: SoporteComponent },
      { path: 'solicitar-prestamo', component: LoanRequestComponent },
      { path: 'mis-prestamos', component: MyLoansComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Rutas para el área de administración
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', component: AdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
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
    AdminComponent,
    SplashComponent,
    LoginComponent,
    UserProfileComponent,
    AdminLayoutComponent,
    ClientLayoutComponent,
    ClientDashboardComponent,
    AdminDashboardComponent,
    TransactionViewerComponent,
    StudentVerificationComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    WalletService,
    LoanService,
    ContractService,
    NotificationService,
    ThemeService,
    BlockchainExplorerService,
    StudentVerificationService,
    AdminGuard,
    ClientGuard,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}