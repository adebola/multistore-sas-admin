export interface AuthorityModel {
    id: string;
    authority: string;
    createdAt: Date;
    createdBy: string;
    description: string;
}

export interface UserModel {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    createdOn: Date;
    avatarImageUrl: string;
    authorities: AuthorityModel[];
}

export interface UserPage {
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

    content: UserModel[];
}

export interface AuthorityPage {
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

    content: AuthorityModel[];
}
