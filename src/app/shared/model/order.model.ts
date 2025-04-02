export interface OrderModel {
    id: string;
    productName: string;
    orderDate: Date;
    createdBy: string;
    orderStatus: number;
    totalPrice: number;
    userId: string;
    userName: string;
    variant: string;
    variantOption: string;
    uom: string;
    orderShipmentId: string;
    orderShipmentAddress: string;
    orderShipmentStatus: number;
}

export interface OrderPage {
    pageNumber: number;
    pageSize: number;
    pages: number;
    totalSize: number;
    list: OrderModel[];
}
