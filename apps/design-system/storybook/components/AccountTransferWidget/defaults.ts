import { BankAccount, Beneficiary, TransferData } from "./AccountTransferWidget";

export const defaultAvailableAccounts: BankAccount[] = [
  {
    accountNumber: "1234567890",
    accountName: "Rebel Alliance Savings",
    bankName: "Galactic Credit Union",
    bankCode: "021000021",
    currency: "USD",
    balance: 15000.0,
  },
  {
    accountNumber: "0987654321",
    accountName: "Jedi Order Checking",
    bankName: "Coruscant National Bank",
    bankCode: "021000089",
    currency: "USD",
    balance: 8500.5,
  },
  {
    accountNumber: "5555666677",
    accountName: "Starship Maintenance Fund",
    bankName: "Mos Eisley Savings & Loan",
    bankCode: "021000045",
    currency: "USD",
    balance: 3200.75,
  },
];

export const defaultTransferData: TransferData = {
  sourceAccount: defaultAvailableAccounts[0],
  recipientAccount: {
    accountNumber: "9876543210",
    accountName: "Han Solo",
    bankName: "Corellia First Bank",
    bankCode: "021000067",
    currency: "USD",
  },
  amount: 1500.0,
  currency: "USD",
  reference: "Payment for Millennium Falcon repairs",
  transferType: "domestic",
  fee: 2.5,
  status: "draft",
};

export const completedTransferData: TransferData = {
  ...defaultTransferData,
  status: "completed",
  confirmationNumber: "TRF-M4Y7H3F0RC3",
  estimatedArrival: new Date(Date.now() + 86400000).toISOString().split("T")[0],
};

export const internationalTransferData: TransferData = {
  sourceAccount: defaultAvailableAccounts[0],
  recipientAccount: {
    accountName: "Lando Calrissian",
    iban: "BE71096123456769",
    swiftCode: "BESCBEBB",
    bankName: "Cloud City International",
    currency: "EUR",
  },
  amount: 5000.0,
  currency: "USD",
  reference: "Bespin mining investment",
  transferType: "international",
  fee: 25.0,
  exchangeRate: 0.92,
  status: "draft",
};

export const defaultBeneficiaries: Beneficiary[] = [
  {
    id: "ben-001",
    name: "Han Solo",
    nickname: "The Smuggler",
    accountNumber: "9876543210",
    bankName: "Corellia First Bank",
    bankCode: "021000067",
    currency: "USD",
    type: "domestic",
  },
  {
    id: "ben-002",
    name: "Chewbacca",
    accountNumber: "1122334455",
    bankName: "Kashyyyk Credit Union",
    bankCode: "021000099",
    currency: "USD",
    type: "domestic",
  },
  {
    id: "ben-003",
    name: "Princess Leia Organa",
    nickname: "General Organa",
    accountNumber: "5566778899",
    bankName: "Alderaan Memorial Bank",
    bankCode: "021000033",
    currency: "USD",
    type: "domestic",
  },
  {
    id: "ben-004",
    name: "Lando Calrissian",
    nickname: "Cloud City Baron",
    iban: "BE71096123456769",
    swiftCode: "BESCBEBB",
    bankName: "Cloud City International",
    currency: "EUR",
    type: "international",
  },
  {
    id: "ben-005",
    name: "Maz Kanata",
    iban: "DE89370400440532013000",
    swiftCode: "COBADEFFXXX",
    bankName: "Takodana Galactic Bank",
    currency: "EUR",
    type: "international",
  },
];
