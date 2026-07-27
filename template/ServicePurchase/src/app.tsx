/**
 * @file app.tsx
 * @brief Application shell — wraps all pages and handles global lifecycle events.
 */

import React from "react";
import "./static/styles/basic.css";

export default ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return children;
};
