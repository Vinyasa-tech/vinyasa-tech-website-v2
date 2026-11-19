
import {
  BrainCircuit,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  Laptop,
  Megaphone,
  PenTool,
  type LucideIcon,
} from "lucide-react";

import aiImage from "@/assets/images/vinyasa_service_images/ai-machine-learning.jpeg";
import softwareImage from "@/assets/images/vinyasa_service_images/software-mobile-engineering1.jpg";
import webImage from "@/assets/images/vinyasa_service_images/web-digital-solutions.png";
import cloudImage from "@/assets/images/vinyasa_service_images/cloud-infrastructure.jpg";
import databaseImage from "@/assets/images/vinyasa_service_images/data-management.png";
import designImage from "@/assets/images/vinyasa_service_images/graphic-designing.png";
import marketingImage from "@/assets/images/vinyasa_service_images/digital-marketing.png";
import analyticsImage from "@/assets/images/vinyasa_service_images/data-analysis.png";

// =====================================================
// TECHNOLOGY GROUPS
// =====================================================

export interface TechnologyGroups {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  design?: string[];
  creative?: string[];
  video?: string[];
  marketing?: string[];
  analytics?: string[];
  socialMedia?: string[];
  programmingLanguages?: string[];
  machineLearning?: string[];
  deepLearning?: string[];
  aiMl?: string[];
  cloudPlatforms?: string[];
  awsServices?: string[];
  cloudStorageDeployment?: string[];
  cloud?: string[];
  devOps?: string[];
  hostingPlatforms?: string[];
  cloudHosting?: string[];
  hosting?: string[];
  server?: string[];
  databaseTools?: string[];
  tools?: string[];
}

// =====================================================
// SERVICE DETAIL DATA
// =====================================================

export interface ServiceOffering {
  title: string;
  description: string;
}

export interface ServiceDetailData {
  category: string;
  title: string;
  intro: string;
  heading: string;
  description: string;
  image: string;
  icon: LucideIcon;
  capabilities: string[];
  offerings: ServiceOffering[];
  techStack?: string[];
  technologyGroups?: TechnologyGroups;
  tools?: string[];
}

// =====================================================
// SERVICE DETAILS
// =====================================================

export const serviceDetails = {
  // 01. AI & MACHINE LEARNING

  "ai-machine-learning": {
    category: "AI & MACHINE LEARNING",
    title: "AI & Machine Learning",
    intro:
      "Intelligent AI and machine learning solutions designed to automate processes and create smarter business experiences.",
    heading:
      "Turn data and intelligence into smarter business solutions",
    description:
      "We develop practical AI and machine learning solutions that help businesses automate repetitive tasks, analyze information, improve decision-making, and create intelligent digital experiences.",
    image: aiImage,
    icon: BrainCircuit,
    capabilities: [
      "Generative AI",
      "Computer Vision",
      "Predictive Analytics",
      "AI Agentic Automation",
    ],
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
    technologyGroups: {
      programmingLanguages: ["Python", "R", "SQL"],
      machineLearning: ["Scikit-learn", "XGBoost", "TensorFlow"],
      deepLearning: ["Neural Networks", "CNN", "RNN"],
    },
  },

  // 02. SOFTWARE & MOBILE ENGINEERING

  "software-mobile-engineering": {
    category: "SOFTWARE & MOBILE ENGINEERING",
    title: "Software & Mobile Engineering",
    intro:
      "Custom software and mobile solutions built to automate, optimize, and accelerate your business.",
    heading:
      "Build software and mobile experiences around your business needs",
    description:
      "We build custom enterprise software and mobile applications designed around your workflows, users, systems, and business objectives. From new products to modernization and integrations, our solutions are built for practical use and long-term growth.",
    image: softwareImage,
    icon: Code2,
    capabilities: [
      "Enterprise Software",
      "Mobile Applications",
      "API & Systems Integration",
      "Software Modernization",
    ],
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
    technologyGroups: {
      frontend: [
        "Java",
        "JavaScript",
        "TypeScript",
        "Android Studio",
        "Flutter",
        "React Native",
        "Kotlin",
      ],
      backend: ["Node.js", "Express.js", "Firebase"],
      database: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Firebase Firestore",
      ],
    },
  },

  // 03. WEB & DIGITAL SOLUTIONS

  "web-digital-solutions": {
    category: "WEB & DIGITAL SOLUTIONS",
    title: "Web & Digital Solutions",
    intro:
      "Modern, responsive, and SEO-friendly digital solutions that create a powerful online presence.",
    heading:
      "Create digital experiences that work for your business",
    description:
      "We design and develop modern web applications, e-commerce platforms, and user experiences that help businesses communicate clearly, serve customers effectively, and build a strong digital presence.",
    image: webImage,
    icon: Laptop,
    capabilities: [
      "Web Applications",
      "E-Commerce Platforms",
      "UI/UX Design",
      "Growth Marketing & SEO",
    ],
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
    technologyGroups: {
      frontend: [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "TypeScript",
        "Tailwind CSS",
        "Next.js",
      ],
      backend: ["Node.js", "Express.js", "PHP", "Python"],
      database: ["MySQL", "PostgreSQL", "MongoDB"],
    },
  },

  // 04. CLOUD & INFRASTRUCTURE

  "cloud-infrastructure": {
    category: "CLOUD & INFRASTRUCTURE",
    title: "Cloud & Infrastructure",
    intro:
      "Scalable and secure cloud and infrastructure solutions that improve flexibility, performance, and business efficiency.",
    heading:
      "Build infrastructure that stays reliable as your business grows",
    description:
      "We help businesses adopt and manage cloud infrastructure, deployment environments, hosting, and supporting technologies that improve scalability, accessibility, reliability, and operational efficiency.",
    image: cloudImage,
    icon: Cloud,
    capabilities: [
      "Cloud Architecture",
      "Cloud Migration",
      "DevOps & CI/CD",
      "Managed Hosting & CDN",
    ],
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
          "Enterprise hosting infrastructure management, high-performance speeds, and uptime monitoring.",
      },
    ],
    technologyGroups: {
      cloudPlatforms: [
        "Amazon Web Services (AWS)",
        "Microsoft Azure",
        "Oracle Cloud",
      ],
      awsServices: [
        "EC2 – Virtual Servers",
        "S3 – Object Storage",
        "RDS – Managed Database",
        "Lambda – Serverless Computing",
      ],
      cloudStorageDeployment: [
        "AWS S3",
        "Google Cloud Storage",
        "Cloudinary",
        "Vercel",
      ],
      devOps: ["CI/CD"],
      hostingPlatforms: ["Hostinger", "GoDaddy", "Bluehost"],
      cloudHosting: [
        "AWS",
        "Microsoft Azure",
        "Google Cloud",
        "Linode",
        "Vercel",
      ],
      server: ["Apache", "Nginx", "Node.js", "Linux"],
    },
  },

  // 05. DATA MANAGEMENT

  "data-management": {
    category: "DATA MANAGEMENT",
    title: "Data Management",
    intro:
      "Reliable data and database solutions for secure management, high performance, scalability, and business growth.",
    heading:
      "Organize and manage your business data with confidence",
    description:
      "We design and manage reliable data solutions that help businesses store, organize, protect, migrate, and access information efficiently. Our approach focuses on performance, security, scalability, and long-term reliability.",
    image: databaseImage,
    icon: Database,
    capabilities: [
      "Database Architecture",
      "Performance Optimization",
      "Data Warehousing",
      "Migration & Recovery",
    ],
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
          "Safely moving data between platforms with a focus on data integrity and minimizing downtime.",
      },
    ],
    technologyGroups: {
      databaseTools: [
        "MySQL Workbench",
        "pgAdmin",
        "MongoDB Compass",
        "phpMyAdmin",
        "Prisma",
        "Drizzle ORM",
      ],
      database: ["MySQL", "PostgreSQL", "MongoDB"],
      tools: [
        "MySQL Workbench",
        "MongoDB Compass",
        "pgAdmin",
      ],
    },
  },

  // 06. GRAPHIC DESIGNING

  "graphic-designing": {
    category: "GRAPHIC DESIGNING",
    title: "Graphic Designing",
    intro:
      "Creative designs that communicate your brand and leave a lasting impact.",
    heading:
      "Give your brand a visual identity people remember",
    description:
      "We create creative and professional visual designs that help businesses communicate their identity effectively across digital, marketing, branding, and print platforms.",
    image: designImage,
    icon: PenTool,
    capabilities: [
      "Brand Identity",
      "Logo Design",
      "Marketing Creatives",
      "Social Media Designs",
      "Digital Graphics",
      "Print Designs",
    ],
    offerings: [
      {
        title: "Brand Identity",
        description:
          "Visual identity solutions that communicate your brand consistently across platforms.",
      },
      {
        title: "Logo Design",
        description:
          "Professional logo concepts designed to establish a clear and memorable brand identity.",
      },
      {
        title: "Marketing Creatives",
        description:
          "Creative visual assets for campaigns, promotions, advertisements, and business communication.",
      },
      {
        title: "Social Media Designs",
        description:
          "Engaging social media graphics designed for digital campaigns and audience communication.",
      },
      {
        title: "Digital Graphics",
        description:
          "Custom digital visuals designed for websites, campaigns, presentations, and online communication.",
      },
      {
        title: "Print Designs",
        description:
          "Professional print-ready designs for brochures, business materials, and promotional communication.",
      },
    ],
    technologyGroups: {
      design: [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe InDesign",
      ],
      video: [
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "Adobe Audition",
      ],
    },
  },

  // 07. DIGITAL MARKETING

  "digital-marketing": {
    category: "DIGITAL MARKETING",
    title: "Digital Marketing",
    intro:
      "Grow your brand online with result-driven strategies and data-backed marketing.",
    heading:
      "Grow your brand and reach the right audience",
    description:
      "We help businesses strengthen their online presence through focused digital marketing strategies, creative content, campaigns, and data-driven approaches.",
    image: marketingImage,
    icon: Megaphone,
    capabilities: [
      "Social Media Marketing",
      "Digital Campaigns",
      "Content Marketing",
      "Search Visibility",
      "Brand Promotion",
      "Online Advertising",
    ],
    offerings: [
      {
        title: "Social Media Marketing",
        description:
          "Social media strategies and content designed to strengthen brand presence and audience engagement.",
      },
      {
        title: "Digital Campaigns",
        description:
          "Focused digital campaigns designed around business goals, audience reach, and engagement.",
      },
      {
        title: "Content Marketing",
        description:
          "Content strategies that communicate your brand and support long-term digital growth.",
      },
      {
        title: "Search Visibility",
        description:
          "Strategies designed to improve online search visibility and help your audience discover your business.",
      },
      {
        title: "Brand Promotion",
        description:
          "Digital promotional activities that strengthen brand awareness and reach relevant audiences.",
      },
      {
        title: "Online Advertising",
        description:
          "Paid digital advertising campaigns designed to connect your business with targeted audiences.",
      },
    ],
    technologyGroups: {
      marketing: ["Google Ads", "Meta Ads Manager"],
      socialMedia: ["Instagram", "Facebook", "YouTube"],
    },
  },

  // 08. DATA AND ANALYSIS

  "data-and-analysis": {
    category: "DATA AND ANALYSIS",
    title: "Data and Analysis",
    intro:
      "Transform raw data into meaningful insights with analytics, reporting, and visualization solutions that support smarter business decisions.",
    heading:
      "Turn complex data into clear, actionable business insights",
    description:
      "We help businesses understand their data through analysis, interactive dashboards, visual reporting, and forecasting. Our solutions make it easier to identify trends, measure performance, and make informed decisions.",
    image: analyticsImage,
    icon: ChartNoAxesCombined,
    capabilities: [
      "Data Analytics",
      "Business Intelligence",
      "Data Visualization",
      "Statistical Analysis",
      "Performance Reporting",
      "Data-Driven Decisions",
    ],
    offerings: [
      {
        title: "Data Analytics",
        description:
          "Analyzing business data to identify trends, patterns, performance gaps, and opportunities for growth.",
      },
      {
        title: "Business Intelligence & Reporting",
        description:
          "Building interactive dashboards and business reports using Power BI, Tableau, and related analytics tools.",
      },
      {
        title: "Data Visualization",
        description:
          "Presenting complex information through clear charts, graphs, and visual dashboards that are easy to understand.",
      },
      {
        title: "Statistical Analysis & Forecasting",
        description:
          "Using statistical methods and historical data to explore trends and support business planning.",
      },
    ],
    technologyGroups: {
      programmingLanguages: ["Python", "R", "SQL"],
      analytics: [
        "Microsoft Power BI",
        "Tableau",
        "Microsoft Excel",
        "Google Analytics",
      ],
      database: ["MySQL", "PostgreSQL"],
      tools: [
        "Jupyter Notebook",
        "Microsoft Excel",
        "Power BI",
        "Tableau",
      ],
    },
  },
} satisfies Record<string, ServiceDetailData>;

export type ServiceKey = keyof typeof serviceDetails;
