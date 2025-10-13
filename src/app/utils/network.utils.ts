import { APP_CONSTANTS } from '../constants/app.constants';

export class NetworkUtils {
  // Obtener nombre de red por valor
  static getNetworkName(networkValue: string): string {
    const network = Object.values(APP_CONSTANTS.NETWORKS).find(n => n.value === networkValue);
    return network ? network.name : networkValue;
  }

  // Obtener límite de red por valor
  static getNetworkLimit(networkValue: string): number {
    const network = Object.values(APP_CONSTANTS.NETWORKS).find(n => n.value === networkValue);
    return network ? network.limit : 0;
  }

  // Verificar si es una red válida
  static isValidNetwork(networkValue: string): boolean {
    return Object.values(APP_CONSTANTS.NETWORKS).some(n => n.value === networkValue);
  }

  // Obtener todas las redes disponibles
  static getAvailableNetworks(): Array<{name: string, value: string, limit: number}> {
    return Object.values(APP_CONSTANTS.NETWORKS);
  }
}