import type { Metadata } from "next";
import { createMetadata } from "@repo/seo/metadata";
import { AISettingsPage } from "@/components/settings/ai-settings-page";

export const metadata: Metadata = createMetadata({
  title: "AI Settings",
  description:
    "Customize how Yuba interacts with you and provides recommendations",
});

export default function AISettingsPageRoute() {
  return <AISettingsPage />;
}
