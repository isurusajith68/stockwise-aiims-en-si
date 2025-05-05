"use client";
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
import { Moon, Sun } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  console.log(theme);
  // Function to handle smooth scrolling
  const handleSmoothScroll = (e) => {
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

        // Update URL without page reload
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems
          items={navItems.map((item) => ({
            ...item,
            onClick: handleSmoothScroll,
          }))}
        />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary">
            <Link to="/login">Login</Link>
          </NavbarButton>
          <NavbarButton variant="primary" href="#join">
            Join
          </NavbarButton>
          <NavbarButton
            variant="secondary"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
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
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Join
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
