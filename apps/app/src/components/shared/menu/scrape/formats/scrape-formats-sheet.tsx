'use client';

import { cn } from '@repo/design/lib/utils';
import { FileText, Code, Camera, Database } from '@phosphor-icons/react/dist/ssr';
import { useAtom } from 'jotai';
import { scrapeFormatsModalOpenAtom } from '@/atoms/modals';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';

interface Format {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const FORMATS: Format[] = [
  { id: 'markdown', label: 'Markdown', icon: FileText, description: 'Clean, formatted text' },
  { id: 'html', label: 'HTML', icon: Code, description: 'Cleaned HTML markup' },
  { id: 'rawHtml', label: 'Raw HTML', icon: Code, description: 'Original HTML source' },
  { id: 'screenshot', label: 'Screenshot', icon: Camera, description: 'Visual capture' },
  { id: 'json', label: 'JSON', icon: Database, description: 'Structured data' },
];

// Atom to store formats state and callback
import { atom } from 'jotai';
export const scrapeFormatsCallbackAtom = atom<{
  formats: string[];
  onFormatsChange: (formats: string[]) => void;
} | null>(null);

export function ScrapeFormatsSheet() {
  const [isOpen, setIsOpen] = useAtom(scrapeFormatsModalOpenAtom);
  const [callback] = useAtom(scrapeFormatsCallbackAtom);
  
  if (!callback) return null;
  
  const { formats, onFormatsChange } = callback;
  
  const handleFormatToggle = (formatId: string) => {
    if (formats.includes(formatId)) {
      onFormatsChange(formats.filter(f => f !== formatId));
    } else {
      onFormatsChange([...formats, formatId]);
    }
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Select Formats"
      position="bottom"
    >
      <div className="p-4">
        <div className="space-y-1">
          {FORMATS.map((format) => {
            const Icon = format.icon;
            const isSelected = formats.includes(format.id);
            
            return (
              <button
                key={format.id}
                type="button"
                onClick={() => handleFormatToggle(format.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-colors duration-200",
                  "hover:bg-muted",
                  isSelected && "bg-muted"
                )}
              >
                <div className={cn(
                  "h-4 w-4 rounded border transition-all duration-200",
                  isSelected 
                    ? "bg-fire-orange border-fire-orange" 
                    : "bg-background border-border"
                )}>
                  {isSelected && (
                    <svg className="w-full h-full text-white p-0.5" viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                      />
                    </svg>
                  )}
                </div>
                <Icon 
                  size={16} 
                  weight={isSelected ? "fill" : "regular"} 
                  className="text-muted-foreground"
                />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{format.label}</p>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MobileSheet>
  );
}