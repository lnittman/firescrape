'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Image as ImageIcon, Link as LinkIcon } from '@phosphor-icons/react/dist/ssr';
import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseImage,
  GlimpseTitle,
} from '@repo/design/components/kibo/glimpse';

interface MarkdownWithGlimpseProps {
  content: string;
  className?: string;
}

export function MarkdownWithGlimpse({ content, className }: MarkdownWithGlimpseProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Custom list rendering with link icons as bullets
        ul: ({ children }) => (
          <ul className="!list-none space-y-2 my-4 !pl-0 !ml-0">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="relative pl-5">
            <LinkIcon size={14} weight="thin" className="absolute left-0 top-1 text-muted-foreground" />
            <span>{children}</span>
          </li>
        ),
        // Custom image renderer - show as link with hover preview
        img: ({ src, alt }) => {
          if (!src) return null;
          
          return (
            <div className="relative pl-5 inline-block">
              <ImageIcon size={14} weight="thin" className="absolute left-0 top-1 text-muted-foreground" />
              <Glimpse>
                <GlimpseTrigger asChild>
                  <a
                    href={typeof src === 'string' ? src : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {alt || 'View image'}
                  </a>
              </GlimpseTrigger>
              <GlimpseContent className="w-80">
                <GlimpseImage src={typeof src === 'string' ? src : '#'} alt={alt || ''} />
                {alt && <GlimpseTitle>{alt}</GlimpseTitle>}
              </GlimpseContent>
            </Glimpse>
          </div>
          );
        },
        // Also handle links that might be images
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          
          // Check if the link is likely an image
          const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(href);
          
          if (isImageUrl) {
            return (
              <div className="relative pl-5 inline-block">
                <ImageIcon size={14} weight="thin" className="absolute left-0 top-1 text-muted-foreground" />
                <Glimpse>
                  <GlimpseTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children || 'View image'}
                    </a>
                  </GlimpseTrigger>
                  <GlimpseContent className="w-80">
                    <GlimpseImage src={href} alt={String(children)} />
                    {children && <GlimpseTitle>{String(children)}</GlimpseTitle>}
                  </GlimpseContent>
                </Glimpse>
              </div>
            );
          }
          
          // Regular link
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          );
        },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}