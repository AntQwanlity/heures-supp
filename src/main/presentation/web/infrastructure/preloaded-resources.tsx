"use client";

import React from "react";
import ReactDOM from "react-dom";

export const PreloadedResources: React.FC = () => {
  // @ts-ignore
  ReactDOM.preconnect("https://fonts.googleapis.com");
  // @ts-ignore
  ReactDOM.preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });
  return null;
};
