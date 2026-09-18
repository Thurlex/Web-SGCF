export interface Customer {
  id: number;
  cnpj: string;
  cpf: string;
  name: string;
  languageSpeak: string[];
  countryCustomer: string;
  email: string;
}

export interface CustomerRequest {
  cnpj: string;
  cpf: string;
  name: string;
  languageSpeak: string[];
  countryCustomer: string;
  email: string;
}
