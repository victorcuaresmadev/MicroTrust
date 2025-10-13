export const APP_CONSTANTS = {
  COMPANY_NAME: 'MicroTrust',
  COMPANY_RUC: '20537570220',
  LENDER_ADDRESS: '0x430B607db26DB81c563d76756f1a3806889221F7',
  ADMIN_ADDRESSES: [
    '0x7108FfF8116FE14b8a045F98d0083F11a3D6e265',
  ],
  NETWORKS: {
    GOERLI: { name: 'Goerli', value: 'goerli', limit: 20 },
    HOLESKY: { name: 'Holešky', value: 'holesky', limit: 20 },
    SEPOLIA: { name: 'Sepolia', value: 'sepolia', limit: 5 },
    EPHEMERY: { name: 'Ephemery', value: 'ephemery', limit: 5 }
  },
  PURPOSE_TYPES: {
    STUDENT: { value: 'student', label: 'Soy estudiante (pagar mi mensualidad)', interestRate: 0.05 },
    BUSINESS: { value: 'business', label: 'Tengo un negocio', interestRate: 0.10 },
    OTHER: { value: 'other', label: 'Otro propósito', interestRate: 0.18 }
  },
  LOAN_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DISBURSED: 'disbursed'
  },
  LOAN_STATUS_LABELS: {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    disbursed: 'Desembolsado'
  },
  PURPOSE_TYPE_LABELS: {
    student: 'Estudiante',
    business: 'Negocio',
    other: 'Otro'
  },
  NETWORK_LABELS: {
    goerli: 'Goerli',
    holesky: 'Holešky',
    sepolia: 'Sepolia',
    ephemery: 'Ephemery'
  }
};