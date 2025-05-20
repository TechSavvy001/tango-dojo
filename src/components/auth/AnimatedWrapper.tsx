// components/auth/AnimatedWrapper.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";

export default function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
