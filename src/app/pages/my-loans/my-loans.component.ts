import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { ContractService } from '../../services/contract/contract.service';
import { LoanRequest } from '../../interfaces/loan.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.css']
})
export class MyLoansComponent implements OnInit {
  account: string | null = null;
  loans: LoanRequest[] = [];
  error: string | null = null;
  selectedLoan: LoanRequest | null = null;
  contractPreview: string = '';
  showContractPreview: boolean = false;
  isPaying: boolean = false; // Para mostrar estado de pago
  showTransactionViewer: boolean = false;
  transactionViewerLoan: LoanRequest | null = null;

  constructor(
    private wallet: WalletService,
    private loanService: LoanService,
    private contractService: ContractService
  ) {}
  
  ngOnInit() {
    this.loadAccountAndLoans();
  }
  
  async loadAccountAndLoans() {
    try {
      const accounts = await this.wallet.getAccounts();
      if (accounts && accounts.length > 0) {
        this.account = accounts[0];
        this.loans = this.loanService.getLoansByBorrower(this.account);
      } else {
        this.error = 'No se ha detectado una wallet conectada. Por favor, conecta tu wallet para ver tus préstamos.';
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
      case 'paid': return 'status-paid';
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
  
  selectLoan(loan: LoanRequest) {
    this.selectedLoan = loan;
  }
  
  deselectLoan() {
    this.selectedLoan = null;
  }

  // Método para abrir el visor de transacciones
  openTransactionViewer(loan: LoanRequest) {
    this.transactionViewerLoan = loan;
    this.showTransactionViewer = true;
  }

  // Método para cerrar el visor de transacciones
  closeTransactionViewer() {
    this.showTransactionViewer = false;
    this.transactionViewerLoan = null;
  }

  // Generar e imprimir contrato
  generateAndPrintContract(loan: LoanRequest): void {
    this.contractService.generateContract(loan);
  }

  // Descargar contrato
  downloadContract(loan: LoanRequest): void {
    this.contractService.downloadContract(loan);
  }

  // Ver contrato en nueva pestaña
  viewContract(loan: LoanRequest): void {
    this.contractService.viewContract(loan);
  }

  // Imprimir contrato directamente
  printContract(loan: LoanRequest): void {
    this.contractService.printContract(loan);
  }
  
  // Método para ver el motivo del rechazo
  async viewRejectionReason(loan: LoanRequest) {
    if (!loan.rejectionReason) {
      await Swal.fire({
        icon: 'info',
        title: 'Préstamo Rechazado',
        text: 'No se proporcionó información adicional sobre el rechazo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6b7280',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-professional',
          confirmButton: 'swal-btn'
        }
      });
      return;
    }

    await Swal.fire({
      icon: 'error',
      title: 'Préstamo Rechazado',
      html: `
        <div class="rejection-details">
          <div class="rejection-icon-container">
            <i class="fas fa-times-circle" style="font-size: 3.5rem; color: #ef4444; margin-bottom: 1rem;"></i>
          </div>
          <p style="font-size: 1.05rem; margin: 1.5rem 0; color: var(--text-secondary);">Tu solicitud de préstamo ha sido rechazada por el siguiente motivo:</p>
          <div style="padding: 1.25rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 1.5rem 0; text-align: left;">
            <p style="font-size: 0.85rem; color: #ef4444; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fas fa-info-circle"></i> Motivo del Rechazo
            </p>
            <p style="font-size: 1rem; color: var(--text-primary); line-height: 1.6; margin: 0;">${loan.rejectionReason}</p>
          </div>
          ${loan.rejectedAt ? `
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem;">
              <i class="fas fa-clock"></i> Fecha de rechazo: ${new Date(loan.rejectedAt).toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          ` : ''}
          <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 212, 255, 0.1); border-radius: 8px; border: 1px solid rgba(0, 212, 255, 0.3);">
            <p style="font-size: 0.9rem; color: var(--text-primary); margin: 0;">
              <i class="fas fa-lightbulb" style="color: #00d4ff;"></i> Puedes realizar una nueva solicitud corrigiendo los aspectos mencionados.
            </p>
          </div>
        </div>
      `,
      confirmButtonText: '<i class="fas fa-check"></i> Entendido',
      confirmButtonColor: '#6b7280',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      customClass: {
        popup: 'swal-professional swal-wide',
        confirmButton: 'swal-btn'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }

  // Método para pagar un préstamo
  async payLoan(loan: LoanRequest) {
    if (!this.account) {
      await Swal.fire({
        title: 'Wallet no conectada',
        text: 'Debes conectar tu wallet primero',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    // Confirmar con el usuario antes de proceder
    const totalAmount = loan.amount + (loan.amount * loan.interestRate);
    const result = await Swal.fire({
      title: '¿Pagar préstamo?',
      html: `
        <p>¿Estás seguro de que quieres pagar este préstamo?</p>
        <br>
        <p><strong>Monto principal:</strong> ${loan.amount} ETH</p>
        <p><strong>Interés:</strong> ${(loan.amount * loan.interestRate).toFixed(4)} ETH</p>
        <p><strong>Total a pagar:</strong> ${totalAmount.toFixed(4)} ETH</p>
        <br>
        <p>Esta acción no se puede deshacer.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    this.isPaying = true;
    try {
      const result = await this.loanService.payLoan(loan.id, this.account);
      if (result.success) {
        await Swal.fire({
          title: '¡Pago realizado!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        // Actualizar la lista de préstamos
        this.loans = this.loanService.getLoansByBorrower(this.account);
      } else {
        await Swal.fire({
          title: 'Error',
          text: `Error al pagar el préstamo: ${result.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error: any) {
      console.error('Error al pagar el préstamo:', error);
      await Swal.fire({
        title: 'Error',
        text: `Error al pagar el préstamo: ${error.message || 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.isPaying = false;
    }
  }
}