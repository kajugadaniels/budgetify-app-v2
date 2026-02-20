export const CREDIT_ACTIONS = {
  signIn: {
    label: "sign in",
    credits: 20,
  },
} as const;

export type CreditActionKey = keyof typeof CREDIT_ACTIONS;

export function getActionCreditCost(action: CreditActionKey, units = 1) {
  return CREDIT_ACTIONS[action].credits * units;
}
