"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  CREDIT_ACTIONS,
  type CreditActionKey,
  getActionCreditCost,
} from "@/constants/credit-actions";
import {
  CREDIT_EARNED_EVENT,
  CreditGainFeedback,
} from "@/components/shared/credits/CreditGainFeedback";

const CREDIT_STORAGE_KEY = "budgetify.credits";

function readInitialCredits() {
  if (typeof window === "undefined") return 0;
  const savedCredits = window.localStorage.getItem(CREDIT_STORAGE_KEY);
  const parsedCredits = Number(savedCredits);
  return Number.isFinite(parsedCredits) && parsedCredits >= 0 ? parsedCredits : 0;
}

type AttemptActionParams = {
  action: CreditActionKey;
  onAllowed: () => void;
  units?: number;
};

type CreditContextValue = {
  credits: number;
  getRequiredCredits: (action: CreditActionKey, units?: number) => number;
  attemptAction: (params: AttemptActionParams) => boolean;
};

const CreditContext = createContext<CreditContextValue | null>(null);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(readInitialCredits);
  const creditsRef = useRef(credits);

  const setCreditsSync = useCallback((value: number) => {
    creditsRef.current = value;
    setCredits(value);
  }, []);

  const incrementCredits = useCallback(
    (amount = 1) => {
      setCreditsSync(Math.max(0, creditsRef.current + amount));
    },
    [setCreditsSync]
  );

  const spendCredits = useCallback(
    (amount: number) => {
      setCreditsSync(Math.max(0, creditsRef.current - amount));
    },
    [setCreditsSync]
  );

  const getRequiredCredits = useCallback(
    (action: CreditActionKey, units = 1) => getActionCreditCost(action, units),
    []
  );

  const attemptAction = useCallback(
    ({ action, onAllowed, units = 1 }: AttemptActionParams) => {
      const requiredCredits = getRequiredCredits(action, units);
      const availableCredits = creditsRef.current;

      if (availableCredits < requiredCredits) {
        const missingCredits = requiredCredits - availableCredits;
        toast.error("Not enough credits", {
          description: `You need ${missingCredits} more credit${
            missingCredits === 1 ? "" : "s"
          } to ${CREDIT_ACTIONS[action].label}. Click anywhere on the page to gain more credits.`,
        });
        return false;
      }

      spendCredits(requiredCredits);
      onAllowed();
      return true;
    },
    [getRequiredCredits, spendCredits]
  );

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      incrementCredits(1);
      window.dispatchEvent(
        new CustomEvent(CREDIT_EARNED_EVENT, {
          detail: {
            x: event.clientX,
            y: event.clientY,
          },
        })
      );
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [incrementCredits]);

  useEffect(() => {
    window.localStorage.setItem(CREDIT_STORAGE_KEY, String(credits));
  }, [credits]);

  const value = useMemo<CreditContextValue>(
    () => ({
      credits,
      getRequiredCredits,
      attemptAction,
    }),
    [credits, getRequiredCredits, attemptAction]
  );

  return (
    <CreditContext.Provider value={value}>
      {children}
      <CreditGainFeedback />
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error("useCredits must be used inside CreditProvider");
  }
  return context;
}
