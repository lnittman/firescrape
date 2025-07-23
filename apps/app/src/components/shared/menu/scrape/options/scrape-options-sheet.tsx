'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { scrapeOptionsModalOpenAtom } from '@/atoms/modals';
import { advancedScrapeOptionsAtom } from '@/atoms/scrape';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { Label } from '@repo/design/components/ui/label';
import { Input } from '@repo/design/components/ui/input';
import { Checkbox } from '@repo/design/components/ui/checkbox';
import { Button } from '@repo/design/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design/components/ui/tabs';
import { Separator } from '@repo/design/components/ui/separator';
import { FileText, Image, Tag, Shield, FilePdf } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';
import type { AdvancedScrapeOptions as ScrapeOptions } from '@/atoms/scrape';

export function ScrapeOptionsSheet() {
  const [isOpen, setIsOpen] = useAtom(scrapeOptionsModalOpenAtom);
  const [options, setOptions] = useAtom(advancedScrapeOptionsAtom);
  const [localOptions, setLocalOptions] = useState<ScrapeOptions>(options);

  const handleSave = () => {
    setOptions(localOptions);
    setIsOpen(false);
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Scrape Options"
      showCloseButton
      contentHeight="auto"
      useScrollGradient={false}
    >
      <Tabs defaultValue="page" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-auto max-w-xs mb-4">
          <TabsTrigger value="page">
            <Tag size={14} />
          </TabsTrigger>
          <TabsTrigger value="features">
            <Shield size={14} />
          </TabsTrigger>
          <TabsTrigger value="screenshot">
            <Image size={14} />
          </TabsTrigger>
        </TabsList>

        <div className="px-6">
          {/* Page Options Tab */}
          <TabsContent value="page" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="excludeTags" className="text-sm font-medium mb-2">
                  Exclude Tags
                </Label>
                <Input
                  id="excludeTags"
                  placeholder="script, .ad, #footer"
                  value={localOptions.excludeTags || ''}
                  onChange={(e) => setLocalOptions({ ...localOptions, excludeTags: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="includeOnlyTags" className="text-sm font-medium mb-2">
                  Include Only Tags
                </Label>
                <Input
                  id="includeOnlyTags"
                  placeholder="article, main, .content"
                  value={localOptions.includeOnlyTags || ''}
                  onChange={(e) => setLocalOptions({ ...localOptions, includeOnlyTags: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="waitFor" className="text-sm font-medium mb-2">
                    Wait for (ms)
                  </Label>
                  <Input
                    id="waitFor"
                    type="number"
                    placeholder="1000"
                    value={localOptions.waitFor || ''}
                    onChange={(e) => setLocalOptions({ ...localOptions, waitFor: parseInt(e.target.value) || undefined })}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="timeout" className="text-sm font-medium mb-2">
                    Timeout (ms)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    placeholder="30000"
                    value={localOptions.timeout || ''}
                    onChange={(e) => setLocalOptions({ ...localOptions, timeout: parseInt(e.target.value) || undefined })}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="maxAge" className="text-sm font-medium mb-2">
                    Max Age (ms)
                  </Label>
                  <Input
                    id="maxAge"
                    type="number"
                    placeholder="14400000"
                    value={localOptions.maxAge || ''}
                    onChange={(e) => setLocalOptions({ ...localOptions, maxAge: parseInt(e.target.value) || undefined })}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>


          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 mt-0">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText size={20} weight="duotone" className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Main content only</p>
                    <p className="text-xs text-muted-foreground">
                      Extract only the main article content
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={localOptions.extractMainContent}
                  onCheckedChange={(checked) => setLocalOptions({ ...localOptions, extractMainContent: !!checked })}
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <FilePdf size={20} weight="duotone" className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Parse PDF files</p>
                    <p className="text-xs text-muted-foreground">
                      1 credit / page
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={localOptions.parsePDFs}
                  onCheckedChange={(checked) => setLocalOptions({ ...localOptions, parsePDFs: !!checked })}
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield size={20} weight="duotone" className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Stealth mode</p>
                    <p className="text-xs text-muted-foreground">
                      5 credits / page
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={localOptions.useStealthMode}
                  onCheckedChange={(checked) => setLocalOptions({ ...localOptions, useStealthMode: !!checked })}
                />
              </label>
            </div>
          </TabsContent>

          {/* Screenshot Tab */}
          <TabsContent value="screenshot" className="space-y-4 mt-0">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <Image size={20} weight="duotone" className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Viewport Screenshot</p>
                    <p className="text-xs text-muted-foreground">
                      Visible area only
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={localOptions.screenshotTypes.viewport}
                  onCheckedChange={(checked) => 
                    setLocalOptions({ 
                      ...localOptions, 
                      screenshotTypes: { ...localOptions.screenshotTypes, viewport: !!checked }
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer">
                <div className="flex items-center gap-3">
                  <Image size={20} weight="duotone" className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Full Page Screenshot</p>
                    <p className="text-xs text-muted-foreground">
                      Entire page height
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={localOptions.screenshotTypes.fullPage}
                  onCheckedChange={(checked) => 
                    setLocalOptions({ 
                      ...localOptions, 
                      screenshotTypes: { ...localOptions.screenshotTypes, fullPage: !!checked }
                    })
                  }
                />
              </label>
            </div>
          </TabsContent>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <Button
            className="w-full bg-fire-orange hover:bg-fire-red"
            onClick={handleSave}
          >
            Apply Options
          </Button>
        </div>
      </Tabs>
    </MobileSheet>
  );
}