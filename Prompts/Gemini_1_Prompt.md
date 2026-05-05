# Role: Senior Full-Stack Architect & Vibe Coding Specialist
# Goal: Build a Global Career Support Platform (HiSponsor)
# User Persona: Non-programmer (Must be maintainable via natural language)

## 1. Project Core Tech Stack
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS
- Database/Auth/Storage: Supabase
- Content Management: Contentful (Headless CMS)
- Multilingual: next-intl or i18next (KO/EN toggle)
- Comments/Discussions: Giscus (GitHub Discussions)

## 2. Mandatory Coding Instructions
- **Strict Adherence to RULE.md**: You must read and follow all instructions in the 'RULE.md' file at all times.
- **Bilingual Documentation**: Every single file must include extremely detailed comments in BOTH Korean and English. Explain "Why" this code exists, not just "What" it does.
- **Zero-Code Maintenance**: Architecture must be designed so a non-programmer can change UI text, colors, or content by editing simple JSON config files or the CMS.
- **Folder Structure**:
  /app/[locale] - Multi-language routing
  /components - Reusable UI elements
  /config - Simple settings files for the user
  /lib - Logic for API and DB

## 3. Page Structure & Logic
- **Home**: Brand storytelling, feature cards, and feedback CTA.
- **Info**: Dynamic routing for Visa/Country info fetched from Contentful. Enable Giscus for comments.
- **Jobs**: Automated job board. Setup Supabase schema to store aggregated data. Include a simple script for RSS/API fetching (to be triggered via GitHub Actions).
- **Template**: A marketplace UI for CV/Resume templates. Use Supabase Storage for file hosting and DB for metadata.
- **Contact**: Clean contact form with email integration (EmailJS or Resend).
- **Global Header**: Language toggle (KO/EN) at the top right.

## 4. Final Deliverable
- Create a 'README.md' in both Korean and English that explains how to maintain the site as if explaining to a 10-year-old.
- Ensure all UI components are responsive and "easy on the eyes" (referencing the provided Soft Coral color palette).

Please start by initializing the project structure and creating the 'RULE.md' file first.