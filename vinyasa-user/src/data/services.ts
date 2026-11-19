import type { LucideIcon } from "lucide-react";

import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Megaphone,
  Laptop,
  PenTool,
  ChartNoAxesCombined
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

export interface ServiceOffering {
  title: string;
  description: string;
}

export interface Service {
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: LucideIcon;
  offerings: ServiceOffering[];
}

// =====================================================
// SERVICES
// =====================================================

export const services: Service[] = [
  // ===================================================
  // 01. AI & MACHINE LEARNING
  // ===================================================

  {
    number: "01",
    title: "AI & Machine Learning",
    slug: "ai-machine-learning",
    shortDescription:
      "Intelligent AI and machine learning solutions designed to automate processes and create smarter business experiences.",
    icon: BrainCircuit,

    offerings: [
      {
        title: "Generative AI & LLM Integration",
        description:
          "Building custom corporate chatbots, integrating OpenAI/Anthropic APIs, and fine-tuning models.",
      },
      {
        title: "Computer Vision Solutions",
        description:
          "Image and video analysis, facial recognition, and automated quality inspection systems.",
      },
      {
        title: "Predictive Analytics & Data Science",
        description:
          "Building forecasting models for sales, risk management, and user behavior.",
      },
      {
        title: "AI Agentic Automation",
        description:
          "Developing autonomous AI agents to automate complex multi-step office workflows.",
      },
    ],
  },

  // ===================================================
  // 02. SOFTWARE & MOBILE ENGINEERING
  // ===================================================

  {
    number: "02",
    title: "Software & Mobile Engineering",
    slug: "software-mobile-engineering",
    shortDescription:
      "Custom software and mobile solutions built to automate, optimize, and accelerate your business.",
    icon: Code2,

    offerings: [
      {
        title: "Custom Enterprise Software (SaaS)",
        description:
          "Building large-scale multi-tenant systems, CRMs, ERPs, and workflow tools from scratch.",
      },
      {
        title: "Mobile App Development",
        description:
          "Native and cross-platform mobile apps using Flutter or React Native for iOS and Android.",
      },
      {
        title: "API & Systems Integration",
        description:
          "Creating custom APIs and securely connecting your software to third-party tools.",
      },
      {
        title: "Software Modernization",
        description:
          "Upgrading slow legacy software, migrating old systems to newer tech stacks, and fixing code architecture.",
      },
    ],
  },

  // ===================================================
  // 03. WEB & DIGITAL SOLUTIONS
  // ===================================================

  {
    number: "03",
    title: "Web & Digital Solutions",
    slug: "web-digital-solutions",
    shortDescription:
      "Modern, responsive, and SEO-friendly digital solutions that create a powerful online presence.",
    icon: Laptop,

    offerings: [
      {
        title: "Custom Web Application Development",
        description:
          "Corporate portals, complex dashboards, and functional web systems.",
      },
      {
        title: "E-Commerce Platforms",
        description:
          "Custom online marketplaces, specialized B2B storefronts, and advanced Shopify or WooCommerce setups.",
      },
      {
        title: "UI/UX Design & Prototyping",
        description:
          "Wireframing, building clickable interactive prototypes, and user research.",
      },
      {
        title: "Growth Marketing & SEO",
        description:
          "Technical search engine optimization, performance ads, conversion rate optimization (CRO), and content strategy.",
      },
    ],
  },

  // ===================================================
  // 04. CLOUD & INFRASTRUCTURE
  // ===================================================

  {
    number: "04",
    title: "Cloud & Infrastructure",
    slug: "cloud-infrastructure",
    shortDescription:
      "Scalable and secure cloud and hosting solutions that improve flexibility, performance, and business efficiency.",
    icon: Cloud,

    offerings: [
      {
        title: "Cloud Architecture & Migration",
        description:
          "Transitioning systems from local servers to AWS, Azure, or Google Cloud (GCP).",
      },
      {
        title: "DevOps & CI/CD Automation",
        description:
          "Setting up automated testing pipelines and zero-downtime deployment environments.",
      },
      {
        title: "Managed Web Hosting & CDN",
        description:
          "Enterprise hosting infrastructure management, high-performance speeds, and 99.9% uptime monitoring.",
      },
    ],
  },

  // ===================================================
  // 05. DATA MANAGEMENT
  // ===================================================

  {
    number: "05",
    title: "Data Management",
    slug: "data-management",
    shortDescription:
      "Reliable data and database solutions for secure management, high performance, scalability, and business growth.",
    icon: Database,

    offerings: [
      {
        title: "Database Design & Architecture",
        description:
          "Setting up secure SQL (PostgreSQL, MySQL) and NoSQL (MongoDB) database systems.",
      },
      {
        title: "Database Optimization & Performance Tuning",
        description:
          "Speeding up slow database queries and cleaning up data pipelines.",
      },
      {
        title: "Big Data & Data Warehousing",
        description:
          "Setting up secure centralized data stores for deep business reporting.",
      },
      {
        title: "Data Migration & Backup Recovery",
        description:
          "Safely moving data between platforms with zero data loss or downtime guarantees.",
      },
    ],
  },

  // ===================================================
  // 06. GRAPHIC DESIGNING
  // ===================================================

  {
    number: "06",
    title: "Graphic Designing",
    slug: "graphic-designing",
    shortDescription:
      "Creative designs that communicate your brand and leave a lasting impact.",
    icon: PenTool,

    // Detailed offerings can be added here
    // once you finalize the exact services you provide.
    offerings: [],
  },

  // ===================================================
  // 07. DIGITAL MARKETING
  // ===================================================

  {
    number: "07",
    title: "Digital Marketing",
    slug: "digital-marketing",
    shortDescription:
      "Grow your brand online with result-driven strategies and data-backed marketing.",
    icon: Megaphone,

    // Detailed offerings can be added here
    // once you finalize the exact services you provide.
    offerings: [],
  },

  // ===================================================
  // 08. DATA AND ANALYSIS
  // ===================================================

  {
    number: "08",
    title: "Data and Analysis",
    slug: "data-and-analysis",
    shortDescription:
  "Transform business data into actionable insights through analytics, reporting, and data visualization.",
    icon: ChartNoAxesCombined,

    offerings: [
      {
        title: "Data Analytics",
        description:
          "Analyzing business data to identify trends, patterns, and opportunities for growth.",
      },
      {
        title: "Business Intelligence & Reporting",
        description:
          "Creating interactive dashboards and reports using Power BI, Tableau, and other analytics tools.",
      },
      {
        title: "Data Visualization",
        description:
          "Presenting complex data through clear charts, graphs, and visual dashboards.",
      },
      {
        title: "Statistical Analysis & Forecasting",
        description:
          "Using statistical methods and historical data to identify trends and support future planning.",
      },
    ],
  },
];