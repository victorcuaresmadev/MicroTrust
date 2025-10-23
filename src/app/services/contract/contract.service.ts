import { Injectable } from '@angular/core';
import { LoanRequest } from '../../interfaces/loan.interface';
import { ContractData } from '../../interfaces/contract.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  
  constructor() { }

  // Generar contrato y abrir ventana de impresión
  async generateContract(loan: LoanRequest): Promise<string> {
    try {
      console.log(`📄 Generando contrato para préstamo ${loan.id}...`);
      
      // Generar contenido HTML del contrato
      const contractHTML = this.generateContractHTML(loan);
      
      // Abrir ventana de impresión directamente
      this.openPrintWindow(contractHTML, loan.id);
      
      console.log(`✅ Contrato generado y listo para imprimir: ${loan.id}`);
      
      return `contract_${loan.id}`;
    } catch (error) {
      console.error('❌ Error al generar el contrato:', error);
      
      await Swal.fire({
        title: '❌ Error al generar contrato',
        text: `Error: ${(error as Error).message || 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      
      return '';
    }
  }

  // Abrir ventana de impresión con el contrato
  private openPrintWindow(htmlContent: string, contractId: string): void {
    // Crear nueva ventana
    const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (printWindow) {
      // Escribir contenido HTML usando innerHTML (método moderno)
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que se cargue completamente y abrir diálogo de impresión
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
      // Mostrar notificación de éxito
      setTimeout(() => {
        Swal.fire({
          title: '🖨️ Contrato Listo para Imprimir',
          html: `
            <div style="text-align: left;">
              <p><strong>✅ Contrato generado exitosamente</strong></p>
              <p><strong>📄 ID:</strong> ${contractId}</p>
              <br>
              <p>Se ha abierto una nueva ventana con el contrato.</p>
              <p>El diálogo de impresión se abrirá automáticamente.</p>
              <br>
              <p><strong>💡 Opciones disponibles:</strong></p>
              <ul>
                <li>🖨️ Imprimir en papel</li>
                <li>💾 Guardar como PDF</li>
                <li>📧 Enviar por email</li>
              </ul>
            </div>
          `,
          icon: 'success',
          confirmButtonText: '👍 Perfecto',
          timer: 5000,
          timerProgressBar: true
        });
      }, 1000);
    } else {
      // Si no se puede abrir la ventana (bloqueador de popups)
      Swal.fire({
        title: '⚠️ Ventana Bloqueada',
        html: `
          <p>El navegador bloqueó la ventana de impresión.</p>
          <br>
          <p><strong>Solución:</strong></p>
          <p>1. Permite ventanas emergentes para este sitio</p>
          <p>2. Intenta nuevamente</p>
          <br>
          <p>O usa el botón de descarga para obtener el archivo.</p>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  }

  // Descargar contrato como archivo HTML
  downloadContract(loan: LoanRequest): void {
    try {
      const contractHTML = this.generateContractHTML(loan);
      const blob = new Blob([contractHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato_${loan.id}_${loan.borrowerName.replace(/\s+/g, '_')}.html`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      // Mostrar confirmación
      Swal.fire({
        title: '💾 Descarga Iniciada',
        html: `
          <p>El contrato se está descargando...</p>
          <p><strong>Archivo:</strong> contrato_${loan.id}_${loan.borrowerName.replace(/\s+/g, '_')}.html</p>
        `,
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Error al descargar contrato:', error);
      Swal.fire({
        title: '❌ Error en Descarga',
        text: 'No se pudo descargar el contrato. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  }

  // Imprimir contrato directamente (sin nueva ventana)
  printContract(loan: LoanRequest): void {
    try {
      const contractHTML = this.generateContractHTML(loan);
      
      // Crear iframe oculto para impresión
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Escribir contenido al iframe
      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(contractHTML);
        iframeDoc.close();
        
        // Imprimir después de cargar
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print();
            
            // Remover iframe después de imprimir
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 1000);
          }, 500);
        };
      }
      
      // Mostrar confirmación
      Swal.fire({
        title: '🖨️ Imprimiendo Contrato',
        html: `
          <p>Se abrirá el diálogo de impresión...</p>
          <p><strong>Contrato:</strong> ${loan.id}</p>
        `,
        icon: 'info',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Error al imprimir contrato:', error);
      Swal.fire({
        title: '❌ Error en Impresión',
        text: 'No se pudo imprimir el contrato. Intenta descargar el archivo.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  }

  // Ver contrato en nueva pestaña (sin imprimir automáticamente)
  viewContract(loan: LoanRequest): void {
    try {
      const contractHTML = this.generateContractHTML(loan);
      const blob = new Blob([contractHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva pestaña
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        // Limpiar URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        
        Swal.fire({
          title: '👁️ Contrato Abierto',
          html: `
            <p>El contrato se ha abierto en una nueva pestaña.</p>
            <p>Desde allí puedes imprimirlo o guardarlo como PDF.</p>
          `,
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        throw new Error('No se pudo abrir la nueva pestaña');
      }
      
    } catch (error) {
      console.error('Error al ver contrato:', error);
      Swal.fire({
        title: '⚠️ Ventana Bloqueada',
        html: `
          <p>El navegador bloqueó la nueva pestaña.</p>
          <p>Permite ventanas emergentes e intenta nuevamente.</p>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  }

  // Generar código QR con datos completos del contrato
  generateQRCode(loan: LoanRequest): string {
    // Crear datos completos para el QR
    const qrData = {
      contractId: loan.id,
      borrower: loan.borrowerName,
      address: loan.borrowerAddress,
      amount: loan.amount,
      interestRate: loan.interestRate,
      network: loan.network,
      purpose: loan.purposeType,
      createdAt: loan.createdAt.toISOString(),
      approvedAt: loan.approvedAt?.toISOString(),
      company: APP_CONSTANTS.COMPANY_NAME,
      ruc: APP_CONSTANTS.COMPANY_RUC,
      verification: `MT-${loan.id}-${Date.now()}`
    };
    
    // Convertir a JSON compacto
    const jsonData = JSON.stringify(qrData);
    
    // Generar QR con API pública (tamaño más grande y mejor calidad)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&ecc=M&data=${encodeURIComponent(jsonData)}`;
  }

  // Obtener datos para el contrato
  getContractData(loan: LoanRequest): ContractData {
    return {
      contractId: loan.id,
      companyName: APP_CONSTANTS.COMPANY_NAME,
      companyRUC: APP_CONSTANTS.COMPANY_RUC,
      lenderAddress: APP_CONSTANTS.LENDER_ADDRESS,
      borrowerName: loan.borrowerName,
      borrowerAddress: loan.borrowerAddress,
      loanAmount: loan.amount,
      interestRate: loan.interestRate,
      totalAmount: loan.amount + (loan.amount * loan.interestRate),
      purpose: loan.purpose,
      network: loan.network,
      createdAt: loan.createdAt,
      approvedAt: loan.approvedAt,
      events: loan.events || '',
      loanDuration: loan.loanDuration || 30,
      qrCode: this.generateQRCode(loan) // Pasar el loan completo para QR más detallado
    };
  }

  // Generar contenido del contrato en formato HTML
  generateContractHTML(loan: LoanRequest): string {
    const contractData = this.getContractData(loan);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contrato de Préstamo - ${contractData.contractId}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f8f9fa;
            color: #333;
          }
          .contract-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #007bff; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 {
            color: #007bff;
            margin: 0 0 10px 0;
          }
          .header h2 {
            color: #333;
            margin: 0 0 5px 0;
          }
          .section { 
            margin: 25px 0; 
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
            background-color: #f8f9fa;
          }
          .section h3 {
            color: #007bff;
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .label { 
            font-weight: bold; 
            color: #555;
          }
          .value { 
            margin-left: 10px; 
            color: #333;
          }
          .qr-code { 
            text-align: center; 
            margin: 30px 0; 
            padding: 20px;
            background: white;
            border-radius: 5px;
            border: 1px solid #eee;
          }
          .qr-code img {
            max-width: 200px;
            height: auto;
          }
          .signature { 
            margin-top: 50px; 
            display: flex;
            justify-content: space-between;
          }
          .signature-column {
            flex: 1;
            text-align: center;
          }
          .signature-line {
            margin-top: 80px;
            border-top: 1px solid #333;
            padding-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #777;
            font-size: 12px;
          }
          .contract-id {
            background: #007bff;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
          }
          @media print {
            body {
              margin: 0;
              background-color: white;
            }
            .contract-container {
              box-shadow: none;
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="contract-container">
          <div class="header">
            <h1>CONTRATO DE PRÉSTAMO</h1>
            <h2>${APP_CONSTANTS.COMPANY_NAME}</h2>
            <p>RUC: ${APP_CONSTANTS.COMPANY_RUC}</p>
            <div class="contract-id">ID: ${contractData.contractId}</div>
          </div>
          
          <div class="section">
            <h3>INFORMACIÓN DEL CONTRATO</h3>
            <p><span class="label">ID del Contrato:</span> <span class="value">${contractData.contractId}</span></p>
            <p><span class="label">Fecha de Creación:</span> <span class="value">${contractData.createdAt.toLocaleString()}</span></p>
            <p><span class="label">Fecha de Aprobación:</span> <span class="value">${contractData.approvedAt ? contractData.approvedAt.toLocaleString() : 'N/A'}</span></p>
          </div>
          
          <div class="section">
            <h3>INFORMACIÓN DEL PRESTATARIO</h3>
            <p><span class="label">Nombre:</span> <span class="value">${contractData.borrowerName}</span></p>
            <p><span class="label">Dirección de Wallet:</span> <span class="value">${contractData.borrowerAddress}</span></p>
          </div>
          
          <div class="section">
            <h3>DETALLES DEL PRÉSTAMO</h3>
            <p><span class="label">Monto del Préstamo:</span> <span class="value">${contractData.loanAmount} ETH</span></p>
            <p><span class="label">Tasa de Interés:</span> <span class="value">${(contractData.interestRate * 100).toFixed(2)}%</span></p>
            <p><span class="label">Monto Total a Pagar:</span> <span class="value">${contractData.totalAmount.toFixed(4)} ETH</span></p>
            <p><span class="label">Duración del Préstamo:</span> <span class="value">${contractData.loanDuration} días</span></p>
            <p><span class="label">Red de Ethereum:</span> <span class="value">${contractData.network}</span></p>
          </div>
          
          <div class="section">
            <h3>PROPÓSITO DEL PRÉSTAMO</h3>
            <p>${contractData.purpose}</p>
          </div>
          
          <div class="section">
            <h3>REGISTRO DE TRANSACCIONES</h3>
            <p>${contractData.events || 'Sin transacciones registradas'}</p>
          </div>
          
          <div class="qr-code">
            <p><strong>Código QR del Contrato:</strong></p>
            <img src="${contractData.qrCode}" alt="Código QR del Contrato" />
            <div style="font-size: 11px; color: #666; margin-top: 15px; text-align: left;">
              <p><strong>Datos incluidos en el QR:</strong></p>
              <ul style="margin: 5px 0; padding-left: 20px;">
                <li>ID del Contrato: ${contractData.contractId}</li>
                <li>Prestatario: ${contractData.borrowerName}</li>
                <li>Wallet: ${contractData.borrowerAddress.substring(0, 10)}...</li>
                <li>Monto: ${contractData.loanAmount} ETH</li>
                <li>Red: ${contractData.network}</li>
                <li>Empresa: ${contractData.companyName}</li>
                <li>RUC: ${contractData.companyRUC}</li>
                <li>Fecha: ${contractData.createdAt.toLocaleDateString()}</li>
                <li>Verificación: MT-${contractData.contractId}-${Date.now()}</li>
              </ul>
              <p style="margin-top: 10px;"><strong>Escanea para verificar autenticidad del contrato</strong></p>
            </div>
          </div>
          
          <div class="signature">
            <div class="signature-column">
              <p><strong>Firma del Prestatario:</strong></p>
              <div class="signature-line">
                ${contractData.borrowerName}
              </div>
            </div>
            <div class="signature-column">
              <p><strong>Firma del Prestamista:</strong></p>
              <div class="signature-line">
                ${APP_CONSTANTS.COMPANY_NAME}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Este contrato es un acuerdo legal entre ${APP_CONSTANTS.COMPANY_NAME} y ${contractData.borrowerName}.</p>
            <p>Fecha de generación: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}