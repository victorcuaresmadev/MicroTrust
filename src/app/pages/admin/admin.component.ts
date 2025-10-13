import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { ContractService } from '../../services/contract/contract.service';
import { LoanRequest } from '../../interfaces/loan.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  account: string | null = null;
  pendingLoans: LoanRequest[] = [];
  filteredLoans: LoanRequest[] = [];
  error: string | null = null;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  filterStatus: string = 'all';
  rejectionReason: string = '';
  loanToReject: LoanRequest | null = null;

  constructor(
    private wallet: WalletService,
    private loanService: LoanService,
    private contractService: ContractService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadAccountAndLoans();
  }
  
  async loadAccountAndLoans() {
    try {
      this.isLoading = true;
      // Verificar si ya hay una cuenta conectada
      const accounts = await this.wallet.getAccounts();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
      } else {
        // Si no hay cuenta, intentar conectar
        this.account = await this.wallet.connect();
      }
      
      if (this.account) {
        // Verificar si es administrador
        this.isAdmin = APP_CONSTANTS.ADMIN_ADDRESSES.includes(this.account);
        
        if (this.isAdmin) {
          this.pendingLoans = this.loanService.getAllLoans(); // Obtener todos los préstamos
          this.filteredLoans = [...this.pendingLoans];
          this.applyFilter();
        } else {
          // Si no es admin, redirigir a la página principal
          this.error = 'No tienes permisos de administrador';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      } else {
        // Si no hay cuenta, redirigir a la página principal
        this.error = 'Debes conectar tu wallet para acceder al panel de administración';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      }
    } catch (e: any) {
      this.error = e?.message || 'Error al cargar la información';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    } finally {
      this.isLoading = false;
    }
  }
  
  applyFilter() {
    if (this.filterStatus === 'all') {
      this.filteredLoans = [...this.pendingLoans];
    } else {
      this.filteredLoans = this.pendingLoans.filter(loan => loan.status === this.filterStatus);
    }
  }
  
  async approveLoan(loan: LoanRequest) {
    if (!this.account || !this.isAdmin) return;
    
    try {
      const success = this.loanService.approveLoan(loan.id, this.account);
      if (success) {
        // Generar contrato
        const contractUrl = this.contractService.generateContract(loan);
        loan.contractUrl = contractUrl;
        loan.status = 'approved';
        
        alert(`Préstamo ${loan.id} aprobado. Contrato generado.`);
        // Recargar la lista de préstamos
        this.loadAccountAndLoans();
      }
    } catch (e: any) {
      this.error = e?.message || 'Error al aprobar el préstamo';
    }
  }
  
  setLoanToReject(loan: LoanRequest) {
    this.loanToReject = loan;
    this.rejectionReason = '';
  }
  
  async rejectLoan() {
    if (!this.account || !this.isAdmin || !this.loanToReject) return;
    
    try {
      const success = this.loanService.rejectLoan(this.loanToReject.id, this.account);
      if (success) {
        alert(`Préstamo ${this.loanToReject.id} rechazado.`);
        this.loanToReject = null;
        this.rejectionReason = '';
        // Recargar la lista de préstamos
        this.loadAccountAndLoans();
      }
    } catch (e: any) {
      this.error = e?.message || 'Error al rechazar el préstamo';
    }
  }
  
  cancelReject() {
    this.loanToReject = null;
    this.rejectionReason = '';
  }
  
  viewContract(loan: LoanRequest) {
    if (loan.contractUrl) {
      // En una implementación real, esto abriría el contrato en una nueva pestaña
      window.open(loan.contractUrl, '_blank');
    } else {
      alert('El contrato aún no está disponible.');
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'disbursed': return 'status-disbursed';
      default: return 'status-pending';
    }
  }
  
  getPurposeTypeLabel(type: string): string {
    return (APP_CONSTANTS.PURPOSE_TYPE_LABELS as any)[type] || type;
  }
  
  getNetworkLabel(network: string): string {
    return (APP_CONSTANTS.NETWORK_LABELS as any)[network] || network;
  }
  
  getStatusLabel(status: string): string {
    return (APP_CONSTANTS.LOAN_STATUS_LABELS as any)[status] || status;
  }
}