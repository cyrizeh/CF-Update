export type CreateCaneDiseaseRequest = {
  idLabResult?: string;
  fdaEligibility?: FDAEligibilityType | null;
  reactivity?: boolean | null;
  reactive?: string | null;
  caneId?: string;
};

enum FDAEligibilityType {
  Yes = 'Yes',
  No = 'No',
  NA = 'N/A',
}
