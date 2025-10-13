import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { LoanRequest } from '../../interfaces/loan.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.css']
})
export class MyLoansComponent implements OnInit {
  account: string | null = null;
  loans: LoanRequest[] = [];
  error: string | null = null;

  constructor(
    private wallet: WalletService,
    private loanService: LoanService
  ) {}
  
  ngOnInit() {
    this.loadAccountAndLoans();
  }
  
  async loadAccountAndLoans() {
    try {
      this.account = await this.wallet.connect();
      if (this.account) {
        this.loans = this.loanService.getLoansByBorrower(this.account);
      }
    } catch (e: any) {
      this.error = e?.message || 'Error al cargar la información';
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
  
  downloadContract(loan: LoanRequest) {
    if (loan.contractUrl) {
      // Simular descarga del contrato
      alert(`Descargando contrato para el préstamo ${loan.id}`);
      // En una implementación real, esto redirigiría a la URL del contrato
    } else {
      alert('El contrato aún no está disponible. Se generará una vez que el préstamo sea aprobado.');
    }
  }
}