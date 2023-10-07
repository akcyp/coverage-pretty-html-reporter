import type { SummarySingleStat } from "../../shared/report-types";

export const statToString = ({ pct, covered, total }: SummarySingleStat) => {
  return `${pct}% (${covered}/${total})`;
};
