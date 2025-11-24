
export enum AppMode {
  NL_TO_CPC = 'NL_TO_CPC',
  CPC_TO_NL = 'CPC_TO_NL',
}

export interface Proposition {
  variable: string;
  meaning: string;
}

export interface NlToCpcResult {
  formula: string;
  propositions: Proposition[];
}

export interface CpcToNlResult {
  sentence: string;
  propositions: Proposition[];
}
