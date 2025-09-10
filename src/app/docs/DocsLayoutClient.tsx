'use client'
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Background } from "@/components/background";
import { LabCTA } from "@/components/mdx/lab-cta";
import { LabsCarousel } from "@/components/mdx/labs-carousel";
import labs from "@/data/labs.yaml";

interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

interface DocsLayoutClientProps {
  navigation: NavItem[];
  children: React.ReactNode;
}

export default function DocsLayoutClient({ navigation, children }: DocsLayoutClientProps) {

  function initializeExpandedSections(navigation: NavItem[]): { [key: string]: boolean } {
    const initial: { [key: string]: boolean } = {};
    navigation.forEach(section => {
      initial[section.title] = false;
      section.items?.forEach(item => {
        if (item.items && item.items.length > 0) {
          initial[item.title] = false;
        }
      });
    });
    return initial;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() =>
    initializeExpandedSections(navigation)
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActiveItem = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <Background />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-256px)]">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden sticky top-0 z-10 bg-background p-4 border-b flex justify-between items-center">
            <span className="font-bold">Documentation</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Sidebar - hidden on mobile unless toggled */}
          <div
            className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 md:border-r border-white/10 overflow-y-auto`}
          >
            <nav className="px-2 md:px-3 py-6 md:py-16 space-y-4 md:space-y-6">
              {navigation.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    {section.href ? (
                      <Link
                        href={section.href}
                        className={`font-black text-lg hover:text-primary transition-colors flex-1 ${isActiveItem(section.href) ? 'underline underline-offset-4' : ''}`}
                        onClick={() => {
                          // Navigate to the page AND expand/collapse if it has sub-items
                          if (section.items && section.items.length > 0) {
                            toggleSection(section.title);
                          }
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        {section.title}
                      </Link>
                    ) : (
                      <div 
                        className={`font-black text-lg flex-1 ${section.items && section.items.length > 0 ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''}`}
                        onClick={() => {
                          if (section.items && section.items.length > 0) {
                            toggleSection(section.title);
                          }
                        }}
                      >
                        {section.title}
                      </div>
                    )}
                    {section.items && section.items.length > 0 && (
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="ml-2 p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                        aria-label={`Toggle ${section.title} section`}
                      >
                        {expandedSections[section.title] ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )} 
                      </button>
                    )}
                  </div>
                  {expandedSections[section.title] && (
                    <ul className="space-y-2">
                      {section.items?.map((item) => (
                        <li key={item.href}>
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              className={`flex-1 text-sm py-1 hover:text-secondary-foreground transition-colors ${isActiveItem(item.href)
                                  ? 'text-secondary-foreground font-bold underline decoration-1 underline-offset-2'
                                  : 'text-secondary-foreground/70 font-bold'
                                }`}
                              onClick={() => {
                                // Navigate to the page AND expand/collapse if it has sub-items
                                if (item.items && item.items.length > 0) {
                                  toggleSection(item.title);
                                }
                                if (window.innerWidth < 768) {
                                  setSidebarOpen(false);
                                }
                              }}
                            >
                              {item.title}
                            </Link>
                            {item.items && item.items.length > 0 && (
                              <button
                                onClick={() => toggleSection(item.title)}
                                className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                                aria-label={`Toggle ${item.title} section`}
                              >
                                {expandedSections[item.title] ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                              </button>
                            )}
                          </div>
                          {item.items && expandedSections[item.title] && (
                            <ul className="ml-4 mt-2 space-y-2">
                              {item.items.map((subItem) => (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className={`block text-sm py-1 hover:text-secondary-foreground ${isActiveItem(subItem.href)
                                        ? 'text-secondary-foreground underline decoration-1 underline-offset-2'
                                        : 'text-secondary-foreground/70'
                                      }`}
                                    onClick={() => {
                                      if (window.innerWidth < 768) {
                                        setSidebarOpen(false);
                                      }
                                    }}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="prose-lg p-4 md:p-8 lg:p-16 flex-1 prose-li:marker:text-muted-foreground prose-ol:list-decimal prose-ul:list-disc prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic overflow-x-hidden">
            {children}

            {labs?.labs && labs.labs.length > 1 ? (
              <LabsCarousel labs={labs.labs} />
            ) : labs?.labs?.length === 1 ? (
              <LabCTA
                title={labs.labs[0].title}
                description={labs.labs[0].description}
                href={labs.labs[0].href}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
} 