import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { LoanService } from '../../services/loan/loan.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.css']
})
export class LoanRequestComponent implements OnInit {
  account: string | null = null;
  chainId: string | null = null;
  error: string | null = null;
  
  // Formulario de solicitud
  loanForm = {
    borrowerName: '',
    amount: null as number | null,
    purpose: '',
    purposeType: 'other' as 'student' | 'business' | 'other',
    network: 'goerli' as 'goerli' | 'holesky' | 'sepolia' | 'ephemery'
  };
  
  // Información calculada
  interestRate: number = APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate;
  totalAmount: number = 0;
  loanLimit: number = APP_CONSTANTS.NETWORKS.GOERLI.limit;
  
  // Redes disponibles
  networks = [
    APP_CONSTANTS.NETWORKS.GOERLI,
    APP_CONSTANTS.NETWORKS.HOLESKY,
    APP_CONSTANTS.NETWORKS.SEPOLIA,
    APP_CONSTANTS.NETWORKS.EPHEMERY
  ];
  
  // Tipos de propósito
  purposeTypes = [
    APP_CONSTANTS.PURPOSE_TYPES.STUDENT,
    APP_CONSTANTS.PURPOSE_TYPES.BUSINESS,
    APP_CONSTANTS.PURPOSE_TYPES.OTHER
  ];
  
  constructor(
    private wallet: WalletService,
    private loanService: LoanService
  ) {}
  
  ngOnInit() {
    this.updateInterestRate();
    this.updateLoanLimit();
  }
  
  async connect() {
    this.error = null;
    try {
      const acc = await this.wallet.connect();
      this.account = acc;
      this.chainId = await this.wallet.getChainId();
      this.updateLoanLimit();
    } catch (e: any) {
      this.error = e?.message || String(e);
    }
  }
  
  updateInterestRate() {
    this.interestRate = this.loanService.calculateInterestRate(this.loanForm.purposeType);
    this.calculateTotalAmount();
  }
  
  updateLoanLimit() {
    if (this.account) {
      this.loanLimit = this.loanService.getLoanLimit(this.loanForm.network);
    }
  }
  
  calculateTotalAmount() {
    if (this.loanForm.amount) {
      this.totalAmount = this.loanForm.amount + (this.loanForm.amount * this.interestRate);
    } else {
      this.totalAmount = 0;
    }
  }
  
  onAmountChange() {
    this.calculateTotalAmount();
  }
  
  onNetworkChange() {
    this.updateLoanLimit();
  }
  
  onPurposeTypeChange() {
    this.updateInterestRate();
  }
  
  async submitLoanRequest() {
    if (!this.account) {
      this.error = 'Debes conectar tu wallet primero';
      return;
    }
    
    if (!this.loanForm.amount || this.loanForm.amount <= 0) {
      this.error = 'El monto debe ser mayor a 0';
      return;
    }
    
    if (this.loanForm.amount > this.loanLimit) {
      this.error = `El monto excede el límite de ${this.loanLimit} para esta red`;
      return;
    }
    
    if (!this.loanForm.borrowerName) {
      this.error = 'Debes ingresar tu nombre';
      return;
    }
    
    if (!this.loanForm.purpose) {
      this.error = 'Debes especificar el propósito del préstamo';
      return;
    }
    
    try {
      const loanRequest = this.loanService.createLoanRequest({
        borrowerName: this.loanForm.borrowerName,
        borrowerAddress: this.account,
        amount: this.loanForm.amount,
        purpose: this.loanForm.purpose,
        purposeType: this.loanForm.purposeType,
        network: this.loanForm.network,
        interestRate: this.interestRate
      });
      
      // Mostrar mensaje de éxito
      alert('Solicitud de préstamo enviada correctamente. Estamos procesando tu solicitud, en 24 horas se reflejará en tu cuenta.');
      
      // Limpiar formulario
      this.loanForm = {
        borrowerName: '',
        amount: null,
        purpose: '',
        purposeType: 'other',
        network: 'goerli'
      };
      
      this.totalAmount = 0;
      this.error = null;
    } catch (e: any) {
      this.error = e?.message || 'Error al enviar la solicitud de préstamo';
    }
  }
}