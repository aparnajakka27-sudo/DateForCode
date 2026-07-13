"use client";

import { useDatabaseSync } from "@/lib/useDatabaseSync";

export default function ThemeAndDatabaseInitializer() {
  useDatabaseSync();
  return null;
}
