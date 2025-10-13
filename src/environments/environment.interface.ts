export interface Environment {
  production: boolean;
  appName: string;
  appVersion: string;
  companyRUC: string;
  lenderAddress: string;
  adminAddresses: string[];
  networks: {
    [key: string]: {
      name: string;
      limit: number;
    };
  };
  interestRates: {
    student: number;
    business: number;
    other: number;
  };
}