"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface WizardStep {
  id: number;
  label: string;
  content: React.ReactNode;
  isValid?: boolean;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onStepChange?: (step: number) => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLoading?: boolean;
}

export function WizardStepper({
  steps,
  currentStep,
  onNext,
  onBack,
  onStepChange,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
}: WizardStepperProps) {
  const currentStepData = steps.find((s) => s.id === currentStep);

  return (
    <div className="grid gap-4">
      {/* Progress Indicator */}
      <div className="flex items-center gap-3">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={[
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer",
                currentStep === step.id
                  ? "border-emerald-600 text-emerald-700"
                  : currentStep > step.id
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "text-muted-foreground",
              ].join(" ")}
              onClick={() => onStepChange?.(step.id)}
            >
              <Badge
                variant={currentStep >= step.id ? "default" : "secondary"}
                className="h-6 w-6 rounded-full p-0 text-center"
              >
                {step.id}
              </Badge>
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Etapa {currentStep} de {steps.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {currentStepData?.content}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {currentStep > 1 && canGoBack ? (
              <Button variant="outline" onClick={onBack} disabled={isLoading}>
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length && canGoNext && (
              <Button onClick={onNext} disabled={isLoading}>
                {isLoading ? "Carregando..." : "Continuar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
