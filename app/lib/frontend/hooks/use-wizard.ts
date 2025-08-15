"use client";

import { useState, useCallback } from "react";

export interface WizardConfig {
  totalSteps: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

export function useWizard({
  totalSteps,
  initialStep = 1,
  onStepChange,
  onComplete,
}: WizardConfig) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepData, setStepData] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  }, [currentStep, totalSteps, goToStep, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const updateStepData = useCallback((step: number, data: any) => {
    setStepData((prev) => ({ ...prev, [step]: data }));
  }, []);

  const isStepCompleted = useCallback(
    (step: number) => completedSteps.has(step),
    [completedSteps]
  );

  const canGoNext = currentStep < totalSteps;
  const canGoPrev = currentStep > 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    completedSteps,
    stepData,
    isLoading,
    setIsLoading,
    goToStep,
    nextStep,
    prevStep,
    updateStepData,
    isStepCompleted,
    canGoNext,
    canGoPrev,
    isLastStep,
  };
}
