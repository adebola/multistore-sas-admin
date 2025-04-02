
export interface TenantModel {
    disabled: boolean;
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    createdBy: string;
}

export interface TenantPage {
    pageable: {
        pageNumber: number;
        pageSize: number;
    },

    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    last: boolean;
    first: boolean;
    size: number;

    content: TenantModel[];
}
