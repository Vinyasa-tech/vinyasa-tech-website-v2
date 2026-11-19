import type { Variants } from "motion/react";

/* =====================================================
   VIEWPORT
   Used for scroll-based animations
===================================================== */

export const viewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -50px 0px",
};

/* =====================================================
   FADE UP
===================================================== */

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   FADE DOWN
===================================================== */

export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   FADE LEFT
===================================================== */

export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   FADE RIGHT
===================================================== */

export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   FADE IN
===================================================== */

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   SCALE IN
===================================================== */

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   CAPABILITY REVEAL
   Technology / feature cards
===================================================== */

export const capabilityReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   SERVICE CARD REVEAL
===================================================== */

export const serviceReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   IMAGE REVEAL
   Hover image zoom
===================================================== */

export const imageReveal: Variants = {
  rest: {
    scale: 1,
  },

  hover: {
    scale: 1.05,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   CARD LIFT
===================================================== */

export const cardLift: Variants = {
  rest: {
    y: 0,
  },

  hover: {
    y: -4,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   STATISTICS REVEAL
   Used for Statistics cards
===================================================== */

export const statisticsReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   STATISTICS ICON
   Used for icon hover / tap
===================================================== */

export const statisticsIcon: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },

  hover: {
    scale: 1.08,
    rotate: -4,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },

  tap: {
    scale: 0.93,
  },
};

/* =====================================================
   STATISTICS NUMBER
   Small entrance animation
===================================================== */

export const statisticsNumber: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/* =====================================================
   STAGGER CONTAINER
===================================================== */

export const staggerContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =====================================================
   SLOW STAGGER CONTAINER
===================================================== */

export const slowStaggerContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

/* =====================================================
   STATISTICS STAGGER
   Slightly slower for timeline/stat cards
===================================================== */

export const statisticsStagger: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};