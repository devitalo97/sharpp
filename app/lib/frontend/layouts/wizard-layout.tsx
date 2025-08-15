"use client";

import type React from "react";
import { PageHeader, type BreadcrumbItem } from "@/components/page-header";
import { WizardStepper, type WizardStep } from "@/components/wizard-stepper";
import { useWizard, type WizardConfig } from "@/hooks/use-wizard";

interface WizardLayoutProps extends Omit<WizardConfig, "onStepChange"> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  steps: WizardStep[];
}

export function WizardLayout({
  title,
  description,
  breadcrumbs,
  headerActions,
  steps,
  totalSteps,
  initialStep,
  onComplete,
}: WizardLayoutProps) {
  const wizard = useWizard({
    totalSteps,
    initialStep,
    onComplete,
  });

  return (
    <div className="grid gap-4">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      <WizardStepper
        steps={steps}
        currentStep={wizard.currentStep}
        onNext={wizard.nextStep}
        onBack={wizard.prevStep}
        onStepChange={wizard.goToStep}
        canGoNext={wizard.canGoNext}
        canGoBack={wizard.canGoPrev}
        isLoading={wizard.isLoading}
      />
    </div>
  );
}
