export type Division = {
  division_name: string
  division_color_code:string
};

export type Pr_details = {
  prDetails_id: string
  pr_dateCreated: string
  pr_requestor: string
  pr_designation: string
  pr_division: string
  pr_purpose: string
  pr_status: string
  timestamp?: string
  remarks?: string
};
