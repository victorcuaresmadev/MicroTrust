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

  // Generar contenido del contrato en formato HTML (DISEÑO PROFESIONAL Y COMPACTO)
  generateContractHTML(loan: LoanRequest): string {
    const contractData = this.getContractData(loan);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contrato de Préstamo - ${contractData.contractId}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            background: #fff;
          }
          
          .contract-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: white;
            position: relative;
          }
          
          /* HEADER COMPACTO */
          .header {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 15px;
            padding: 12px 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: white;
            margin-bottom: 12px;
          }
          
          .header-left h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
          }
          
          .header-left p {
            font-size: 9px;
            opacity: 0.9;
            margin: 2px 0;
          }
          
          .header-right {
            text-align: right;
          }
          
          .contract-id-badge {
            background: rgba(255,255,255,0.2);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
          }
          
          .header-right .date {
            font-size: 8px;
            margin-top: 4px;
            opacity: 0.8;
          }
          
          /* LAYOUT DE 2 COLUMNAS */
          .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          
          /* SECCIÓN COMPACTA */
          .section {
            background: #f8f9fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 10px;
          }
          
          .section-title {
            font-size: 11px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 2px solid #667eea;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .section-content {
            font-size: 9px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px dotted #ddd;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
            flex: 0 0 45%;
          }
          
          .info-value {
            color: #333;
            font-weight: 500;
            text-align: right;
            flex: 1;
          }
          
          /* DESTACADOS FINANCIEROS */
          .financial-highlight {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
          }
          
          .financial-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            text-align: center;
          }
          
          .financial-item {
            padding: 8px;
            background: rgba(255,255,255,0.7);
            border-radius: 6px;
          }
          
          .financial-label {
            font-size: 8px;
            color: #065f46;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .financial-value {
            font-size: 13px;
            font-weight: 700;
            color: #059669;
          }
          
          /* QR Y VERIFICACIÓN */
          .verification-section {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 12px;
            background: #f0f4f8;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 10px;
            margin: 10px 0;
          }
          
          .qr-container {
            text-align: center;
          }
          
          .qr-container img {
            width: 100px;
            height: 100px;
            border: 2px solid #667eea;
            border-radius: 6px;
            background: white;
            padding: 4px;
          }
          
          .qr-container p {
            font-size: 7px;
            color: #667eea;
            margin-top: 4px;
            font-weight: 600;
          }
          
          .verification-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .verification-info h4 {
            font-size: 10px;
            color: #667eea;
            margin-bottom: 6px;
          }
          
          .verification-info ul {
            font-size: 8px;
            list-style: none;
            padding: 0;
          }
          
          .verification-info li {
            padding: 2px 0;
            color: #555;
          }
          
          .verification-info li:before {
            content: "✓ ";
            color: #10b981;
            font-weight: bold;
          }
          
          /* TÉRMINOS */
          .terms-section {
            background: #fff9e6;
            border: 1px solid #fbbf24;
            border-radius: 6px;
            padding: 10px;
            margin: 10px 0;
          }
          
          .terms-section h4 {
            font-size: 10px;
            color: #d97706;
            margin-bottom: 6px;
          }
          
          .terms-section p, .terms-section ul {
            font-size: 8px;
            color: #92400e;
            line-height: 1.5;
          }
          
          .terms-section ul {
            padding-left: 15px;
            margin: 4px 0;
          }
          
          /* FIRMAS COMPACTAS */
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px solid #e1e4e8;
          }
          
          .signature-box {
            text-align: center;
          }
          
          .signature-line {
            border-top: 2px solid #333;
            margin: 25px 10px 6px 10px;
            padding-top: 6px;
          }
          
          .signature-name {
            font-size: 9px;
            font-weight: 700;
            color: #333;
          }
          
          .signature-role {
            font-size: 8px;
            color: #666;
            margin-top: 2px;
          }
          
          /* FOOTER */
          .footer {
            text-align: center;
            font-size: 7px;
            color: #999;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #eee;
          }
          
          /* BADGES */
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 8px;
            font-weight: 600;
          }
          
          .badge-success {
            background: #d1fae5;
            color: #065f46;
          }
          
          .badge-info {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .badge-warning {
            background: #fef3c7;
            color: #92400e;
          }
          
          /* PRINT OPTIMIZATION */
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .contract-page {
              margin: 0;
              padding: 10mm;
              width: 100%;
              box-shadow: none;
            }
            
            .section {
              break-inside: avoid;
            }
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="contract-page">
          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <h1>📄 CONTRATO DE PRÉSTAMO BLOCKCHAIN</h1>
              <p><strong>${APP_CONSTANTS.COMPANY_NAME}</strong></p>
              <p>RUC: ${APP_CONSTANTS.COMPANY_RUC} | Perú 🇵🇪</p>
            </div>
            <div class="header-right">
              <div class="contract-id-badge">
                ID: ${contractData.contractId}
              </div>
              <div class="date">
                📅 ${contractData.createdAt.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          <!-- RESUMEN FINANCIERO DESTACADO -->
          <div class="financial-highlight">
            <div class="financial-grid">
              <div class="financial-item">
                <div class="financial-label">💰 MONTO RECIBIDO</div>
                <div class="financial-value">${contractData.loanAmount} ETH</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">📊 INTERÉS (${(contractData.interestRate * 100).toFixed(1)}%)</div>
                <div class="financial-value">+${(contractData.loanAmount * contractData.interestRate).toFixed(4)} ETH</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">🔴 TOTAL A DEVOLVER</div>
                <div class="financial-value">${contractData.totalAmount.toFixed(4)} ETH</div>
              </div>
            </div>
          </div>
          
          <!-- INFORMACIÓN EN DOS COLUMNAS -->
          <div class="two-columns">
            <!-- PRESTATARIO -->
            <div class="section">
              <div class="section-title">👤 PRESTATARIO (CLIENTE)</div>
              <div class="section-content">
                <div class="info-row">
                  <span class="info-label">Nombre Completo:</span>
                  <span class="info-value">${contractData.borrowerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Wallet Address:</span>
                  <span class="info-value" style="font-size: 7px; font-family: monospace;">${contractData.borrowerAddress.substring(0, 20)}...${contractData.borrowerAddress.substring(38)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Red Blockchain:</span>
                  <span class="info-value">
                    <span class="badge badge-info">${contractData.network.toUpperCase()}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- PRESTAMISTA -->
            <div class="section">
              <div class="section-title">🏢 PRESTAMISTA (EMPRESA)</div>
              <div class="section-content">
                <div class="info-row">
                  <span class="info-label">Razón Social:</span>
                  <span class="info-value">${contractData.companyName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">RUC:</span>
                  <span class="info-value">${contractData.companyRUC}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">País:</span>
                  <span class="info-value">
                    <span class="badge badge-success">Perú 🇵🇪</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- DETALLES DEL PRÉSTAMO -->
          <div class="two-columns">
            <div class="section">
              <div class="section-title">⏰ PLAZOS Y FECHAS</div>
              <div class="section-content">
                <div class="info-row">
                  <span class="info-label">Duración:</span>
                  <span class="info-value">${contractData.loanDuration} días</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha Solicitud:</span>
                  <span class="info-value">${contractData.createdAt.toLocaleDateString('es-PE')}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha Aprobación:</span>
                  <span class="info-value">${contractData.approvedAt ? contractData.approvedAt.toLocaleDateString('es-PE') : 'Pendiente'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Vencimiento:</span>
                  <span class="info-value">
                    <span class="badge badge-warning">
                      ${new Date(contractData.createdAt.getTime() + (contractData.loanDuration || 30) * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">🎯 PROPÓSITO DEL PRÉSTAMO</div>
              <div class="section-content" style="padding: 8px;">
                <p style="font-size: 9px; line-height: 1.5;">
                  ${contractData.purpose}
                </p>
              </div>
            </div>
          </div>
          
          <!-- VERIFICACIÓN CON QR -->
          <div class="verification-section">
            <div class="qr-container">
              <img src="${contractData.qrCode}" alt="QR Verificación" />
              <p>ESCANEAR PARA VERIFICAR</p>
            </div>
            <div class="verification-info">
              <h4>🔒 VERIFICACIÓN DE AUTENTICIDAD</h4>
              <ul>
                <li>ID Contrato: ${contractData.contractId}</li>
                <li>Cliente: ${contractData.borrowerName}</li>
                <li>Monto: ${contractData.loanAmount} ETH en ${contractData.network.toUpperCase()}</li>
                <li>Empresa: ${contractData.companyName}</li>
                <li>Código Verificación: MT-${contractData.contractId}-${Date.now()}</li>
              </ul>
              <p style="font-size: 7px; color: #667eea; margin-top: 6px; font-weight: 600;">
                ✓ Este contrato está registrado en blockchain y es verificable mediante el código QR
              </p>
            </div>
          </div>
          
          <!-- TÉRMINOS Y CONDICIONES -->
          <div class="terms-section">
            <h4>📜 TÉRMINOS Y CONDICIONES</h4>
            <ul>
              <li>El PRESTATARIO se compromete a devolver <strong>${contractData.totalAmount.toFixed(4)} ETH</strong> (incluyendo interés del ${(contractData.interestRate * 100).toFixed(1)}%) en un plazo de <strong>${contractData.loanDuration} días</strong>.</li>
              <li>La transacción se realizará en la red <strong>${contractData.network.toUpperCase()}</strong> de Ethereum.</li>
              <li>En caso de incumplimiento, se aplicarán las cláusulas establecidas en el contrato marco de ${APP_CONSTANTS.COMPANY_NAME}.</li>
              <li>Este contrato es legalmente vinculante y está respaldado por tecnología blockchain.</li>
            </ul>
          </div>
          
          <!-- FIRMAS -->
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line">
                <div class="signature-name">${contractData.borrowerName}</div>
                <div class="signature-role">Prestatario (Cliente)</div>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <div class="signature-name">${APP_CONSTANTS.COMPANY_NAME}</div>
                <div class="signature-role">Prestamista (Empresa)</div>
              </div>
            </div>
          </div>
          
          <!-- FOOTER -->
          <div class="footer">
            <p>Este documento es un contrato legal generado automáticamente por ${APP_CONSTANTS.COMPANY_NAME} | Fecha de generación: ${new Date().toLocaleString('es-PE')}</p>
            <p>Para consultas: contacto@microtrust.edu.pe | RUC: ${APP_CONSTANTS.COMPANY_RUC}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}