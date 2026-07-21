---
title: "Typography & Accessibility in VPN"
subtitle: "Caught a systemic accessibility problem before it broke translations for 60+ languages — cut fix requests from weekly to monthly."
tag: "Accessibility / Infrastructure"
order: 2
ndaBadge: true
heroImage: "/images/case-vpn-typography/hero.svg"
meta:
  - label: "Product"
    value: "VPN apps (desktop, mobile, browser extension)"
  - label: "Scale"
    value: "10M+ users"
  - label: "Localization"
    value: "60+ languages"
  - label: "Environment"
    value: "Living product, no pause for redesign"
statValue: "Weekly → Monthly"
statCaption: "Typography-related fix requests, after the Noto Sans migration"
contextCards:
  - title: "Why the system font became a problem"
    bullets:
      - "Montserrat was used as a system font without considering localization"
      - "Low contrast on key UI elements"
      - "Text did not meet WCAG standards"
quoteTable:
  - role: "Translators"
    whatWentWrong: "Phrases didn't fit UI components and often lost meaning"
    howItAffected: "Incorrect or broken translations in the UI"
    quote: "German translations don't fit the button again — half the word gets cut off."
  - role: "Developers"
    whatWentWrong: "Each new language caused layout issues or broken elements"
    howItAffected: "Constant fixes slowed down release cycles"
    quote: "Every new language feels like a whole new project."
  - role: "QA Testers"
    whatWentWrong: "Every new locale introduced new bugs during testing"
    howItAffected: "Manual re-checking of all localization scenarios each time"
    quote: "Something always breaks — guaranteed."
impactList:
  - label: "Localization fixed"
    description: "Readability and localization issues resolved across 60+ languages"
  - label: "Typography unified"
    description: "Consistent system font across desktop, mobile, and extension"
  - label: "Fix requests"
    description: "Reduced from weekly to once a month"
---

Interfaces on this page are reproduced for portfolio purposes under NDA.
