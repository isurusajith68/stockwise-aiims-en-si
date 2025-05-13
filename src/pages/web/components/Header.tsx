"use client";

import type React from "react";

import { useTheme } from "@/components/theme-provider";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Moon, Sun, Database } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Benefits",
      link: "#benefits",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
    {
      name: "Contact",
      link: "#cta",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo>
          <a
            href="#home"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
          >
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              StockWise AIIMS
            </span>
          </a>
        </NavbarLogo>
        <NavItems
          items={navItems.map((item) => ({
            ...item,
            onClick: handleSmoothScroll,
          }))}
        />
        <div className="flex items-center gap-4">
          {/* <NavbarButton
            variant="secondary"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="/login"
          >
            Login
          </NavbarButton> */}
          <NavbarButton
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link to="/login">Login</Link>
          </NavbarButton>
          <NavbarButton
            variant="secondary"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            className="bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo>
            <a
              href="#home"
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
            >
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                StockWise AIIMS
              </span>
            </a>
          </NavbarLogo>
          <div className="flex items-center gap-2">
            <NavbarButton
              variant="secondary"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className="bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-200 p-2"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </NavbarButton>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={(e) => {
                handleSmoothScroll(e);
                setIsMobileMenuOpen(false);
              }}
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4 mt-4">
            <Link to="/login" className="">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              >
                Login
              </NavbarButton>
            </Link>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              href="#cta"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
              Request Demo
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
