export class ContractUtils {
  // Generar URL de contrato
  static generateContractUrl(loanId: string): string {
    return `contracts/${loanId}.pdf`;
  }

  // Generar URL de código QR
  static generateQRCodeUrl(data: string): string {
    return `qrcodes/${btoa(data)}.png`;
  }

  // Verificar si el contrato está disponible
  static isContractAvailable(contractUrl: string | undefined): boolean {
    return !!contractUrl;
  }

  // Descargar contrato (simulación)
  static downloadContract(contractUrl: string): void {
    // En una implementación real, esto descargaría el archivo
    console.log(`Descargando contrato: ${contractUrl}`);
    // window.open(contractUrl, '_blank');
  }
}