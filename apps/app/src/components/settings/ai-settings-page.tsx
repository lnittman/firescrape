"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MobileSettingsHeader } from "./mobile-settings-header";
import { Button } from "@repo/design/components/ui/button";
import { Textarea } from "@repo/design/components/ui/textarea";
import { Label } from "@repo/design/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import { toast } from "@repo/design/components/ui/sonner";
import { Lightbulb, ChatCircle, User } from "@phosphor-icons/react";

const aiSettingsSchema = z.object({
  rules: z
    .string()
    .max(2000, "Rules must be less than 2000 characters")
    .optional(),
});

type AISettingsForm = z.infer<typeof aiSettingsSchema>;

export function AISettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<AISettingsForm>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      rules: "",
    },
  });

  const rulesValue = watch("rules") || "";
  const characterCount = rulesValue.length;

  const onSubmit = async (data: AISettingsForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save AI settings
      console.log("Saving AI settings:", data);

      toast.success("AI settings updated successfully");
    } catch (error) {
      console.error("Failed to update AI settings:", error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const exampleRules = [
    "I prefer detailed trail descriptions with specific landmarks",
    "Always mention water sources and restroom availability",
    "I have knee issues, so suggest easier alternatives for steep descents",
    "I love photography, so highlight scenic viewpoints",
    "I usually hike with my dog, so mention dog-friendly trails",
  ];

  return (
    <div className="space-y-6">
      {/* Mobile header with back button */}
      <MobileSettingsHeader title="AI Settings" />

      {/* Desktop Header */}
      <div className="hidden sm:block space-y-2 px-6 pt-6">
        <h1 className="text-xl font-semibold">AI Settings</h1>
        <p className="text-muted-foreground">
          Customize how Yuba provides recommendations and interacts with you
        </p>
      </div>

      <div className="px-6 pb-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* AI Rules Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircle className="w-5 h-5" />
                Personal Preferences
              </CardTitle>
              <CardDescription>
                Tell Yuba about your hiking style, preferences, and any specific
                needs. This helps provide more personalized trail
                recommendations and advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rules">Your Hiking Preferences & Needs</Label>
                <Textarea
                  id="rules"
                  placeholder="Tell me about your hiking preferences, fitness level, any physical limitations, favorite types of scenery, or specific things you'd like me to always consider when making recommendations..."
                  className="min-h-[120px] resize-none"
                  {...register("rules")}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {errors.rules ? (
                      <span className="text-destructive">
                        {errors.rules.message}
                      </span>
                    ) : (
                      "Help Yuba understand your outdoor preferences"
                    )}
                  </span>
                  <span
                    className={characterCount > 1800 ? "text-destructive" : ""}
                  >
                    {characterCount}/2000
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Example Preferences
              </CardTitle>
              <CardDescription>
                Here are some examples of helpful preferences you might want to
                share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exampleRules.map((example, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium">Privacy & Data</p>
                  <p>
                    Your preferences help Yuba provide better recommendations.
                    This information is stored securely and only used to
                    personalize your experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
