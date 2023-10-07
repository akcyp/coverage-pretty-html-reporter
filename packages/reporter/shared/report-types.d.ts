export type BlockRange = {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
};

export type CoverageDetail = {
  statementMap: Record<string, BlockRange>;
  lines: Record<string, number>;
  s: Record<string, number>;
  branchMap: Record<
    string,
    {
      type: string; // branch, switch ...
      line: number;
      loc: BlockRange;
      locations: BlockRange[];
    }
  >;
  b: Record<string, number[]>;
  fnMap: Record<
    string,
    {
      name: string;
      decl: BlockRange;
      loc: BlockRange;
    }
  >;
  f: Record<string, number>;
};

export type SummarySingleStat = {
  total: number;
  covered: number;
  pct: number;
  class: "low" | "medium" | "high";
};

export type SummaryStats = Record<"statements" | "branches" | "lines" | "functions", SummarySingleStat>;

export type DirectoryReport = {
  type: "directory";
  root: boolean;
  name: string;
  entity: string;
  stats: SummaryStats;
  childStats: {
    name: string;
    entity: string;
    stats: SummaryStats;
  }[];
  unix: number;
};

export type FileReport = {
  type: "file";
  name: string;
  entity: string;
  stats: SummaryStats;
  path: string;
  detail: CoverageDetail;
  fileContent: string;
  unix: number;
};

export type Report = FileReport | DirectoryReport;
