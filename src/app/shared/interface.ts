export interface IProduct {
  productId: number;
  prodCatId: number;
  prodName: string;
  prodDescription: string;
  prodCat: IProductCategory;
  productAttribute: IProductAttribute[];
}

export interface IProductAttributeLookup {
  attributeId: number;
  prodCatId: number;
  attributeName: string; 
  prodCat: IProductCategory;
  productAttribute: IProductAttribute[];
}

export interface IProductAttribute {
  productAttributeId: number;
  productId: number;
  attributeId: number;
  attributeValue: string;
  attribute: IProductAttributeLookup;
  product: IProduct;
}

export interface IProductCategory {
  prodCatId: number;
  categoryName: string;
  product: IProduct[];
  productAttributeLookup: IProductAttributeLookup[];
}

export interface IPagedResults<T> {
  totalRecords: number;
  results: T;
}




