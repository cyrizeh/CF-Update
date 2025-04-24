export interface Transfer {
    id: string;
    shipmentDate: string;
    state: string;
    clinicName: string;
    clinicId: string;
    clinicTransferStatus: string;
    created: string;
    thawedCount: number;
    atClinicCount: number;
    returnedCount: number;
    numberOfCanes: number;
    createdById: string;
    createdBy: string;
}
