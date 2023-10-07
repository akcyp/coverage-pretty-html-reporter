/// <reference types="vite/client" />

import type { Report } from "../shared/report-types";

declare global {
  interface Window {
    reports?: Report[];
  }
}
