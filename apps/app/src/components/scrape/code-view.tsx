'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, CaretDown, Terminal, FileJs, FilePy } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';

interface CodeViewProps {
  url: string;
  formats: string[];
  onBack: () => void;
}

type Language = 'curl' | 'node' | 'python';

const languageConfig = {
  curl: { 
    label: 'cURL', 
    icon: Terminal,
  },
  node: { 
    label: 'Node.js', 
    icon: FileJs,
  },
  python: { 
    label: 'Python', 
    icon: FilePy,
  }
};

export function CodeView({ url, formats, onBack }: CodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<Language>('curl');
  
  // Ensure URL has protocol
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Generate code examples based on Firecrawl docs
  const codeExamples: Record<Language, string> = {
    curl: `curl -X POST https://api.firecrawl.dev/v1/scrape \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "url": "${fullUrl}",
    "formats": ${JSON.stringify(formats)}
  }'`,
  
    node: `import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: "fc-YOUR_API_KEY" });

// Scrape a website
const scrapeResult = await app.scrapeUrl('${fullUrl}', { 
  formats: ${JSON.stringify(formats)} 
});

if (!scrapeResult.success) {
  throw new Error(\`Failed to scrape: \${scrapeResult.error}\`);
}

console.log(scrapeResult);`,
  
    python: `from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

# Scrape a website
scrape_result = app.scrape_url('${fullUrl}', 
    formats=[${formats.map(f => `'${f}'`).join(', ')}]
)

print(scrape_result)`
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExamples[activeLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLanguage = languageConfig[activeLanguage];
  const ActiveIcon = currentLanguage.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft size={16} weight="duotone" />
          </Button>
          <h2 
            className="text-lg font-medium truncate max-w-md"
            style={{ fontFamily: "'Louize Display', system-ui, sans-serif" }}
          >
            {fullUrl}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
              >
                <ActiveIcon size={16} weight="duotone" />
                <span className="text-sm">{currentLanguage.label}</span>
                <CaretDown size={14} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {(Object.entries(languageConfig) as [Language, typeof languageConfig[Language]][]).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setActiveLanguage(key)}
                    className="gap-2"
                  >
                    <Icon size={16} weight="duotone" />
                    <span>{config.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Copy button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  copied && "border-success text-success"
                )}
              >
                {copied ? (
                  <Check size={16} weight="bold" />
                ) : (
                  <Copy size={16} weight="duotone" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy code'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Code block */}
      <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
        <pre className="p-6 overflow-x-auto">
          <code className="text-sm font-mono text-foreground">
            {codeExamples[activeLanguage]}
          </code>
        </pre>
      </div>

      {/* Additional options for advanced usage */}
      {activeLanguage === 'curl' && (
        <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg space-y-3">
          <h3 className="text-sm font-medium">Additional Options</h3>
          <div className="space-y-2 text-sm text-muted-foreground font-mono">
            <p># Extract only main content</p>
            <p className="pl-4">"onlyMainContent": true</p>
            
            <p># Use stealth mode for anti-bot protection</p>
            <p className="pl-4">"useStealthMode": true</p>
            
            <p># Include links</p>
            <p className="pl-4">"includeLinks": true</p>
          </div>
        </div>
      )}

      {/* API Key notice */}
      <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">
          Replace <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">YOUR_API_KEY</code> with your Firecrawl API key.{' '}
          <a 
            href="https://www.firecrawl.dev/app/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get your API key →
          </a>
        </p>
      </div>
    </motion.div>
  );
}