"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import { cn } from "@repo/design/lib/utils";
import {
  OUTDOOR_ACTIVITIES,
  type OutdoorActivityType,
} from "@/lib/outdoor-activities";

interface MobileInterestPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInterestsSelected: (interests: OutdoorActivityType[]) => void;
  selectedInterests: OutdoorActivityType[];
}

export function MobileInterestPicker({
  isOpen,
  onClose,
  onInterestsSelected,
  selectedInterests = [],
}: MobileInterestPickerProps) {
  const [localSelection, setLocalSelection] = useState<OutdoorActivityType[]>(
    selectedInterests
  );

  const toggleActivity = (activity: OutdoorActivityType) => {
    setLocalSelection((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleDone = () => {
    onInterestsSelected(localSelection);
    onClose();
  };

  const handleClear = () => {
    setLocalSelection([]);
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Pick Your Adventures"
      showCloseButton={true}
      contentHeight="default"
    >
      <div className="flex flex-col h-full">
        {/* Header with actions */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={localSelection.length === 0}
          >
            Clear all
          </button>
          <div className="text-sm text-muted-foreground">
            {localSelection.length} selected
          </div>
          <button
            onClick={handleDone}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Done
          </button>
        </div>

        {/* Activities grid */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {OUTDOOR_ACTIVITIES.map((activity, idx) => {
                const isSelected = localSelection.includes(activity.id);
                return (
                  <motion.button
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => toggleActivity(activity.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                      "hover:shadow-md active:scale-[0.98]",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-foreground/20"
                    )}
                  >
                    {/* Checkmark */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                        >
                          <Check className="h-3 w-3" weight="bold" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon and label */}
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="text-sm font-medium">{activity.name}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Info text */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Select the outdoor activities you enjoy. We'll personalize your
              adventure recommendations based on your interests.
            </p>
          </div>
        </div>
      </div>
    </MobileSheet>
  );
}