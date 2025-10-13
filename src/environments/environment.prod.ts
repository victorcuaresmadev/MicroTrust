export const environment = {
  production: true,
  appName: 'MicroTrust',
  appVersion: '1.0.0',
  companyRUC: '20537570220',
  lenderAddress: '0x430B607db26DB81c563d76756f1a3806889221F7',
  adminAddresses: [
    '0x430B607db26DB81c563d76756f1a3806889221F7'
  ],
  networks: {
    goerli: { name: 'Goerli', limit: 20 },
    holesky: { name: 'Holešky', limit: 20 },
    sepolia: { name: 'Sepolia', limit: 5 },
    ephemery: { name: 'Ephemery', limit: 5 }
  },
  interestRates: {
    student: 0.05,  // 5%
    business: 0.10, // 10%
    other: 0.18     // 18%
  }
};