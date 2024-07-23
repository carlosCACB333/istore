export interface Product {
  id: number;
  name: string;
  original_price: string;
  price: string;
  stock: number;
  description: string;
  rating: String;
  images: string[];
  colors: Color[];
  sizes: Size[];
  company_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductFull extends Product {
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Color {
  color: string;
  hex: string;
  quantity: number;
}

export interface Size {
  code: String;
  quantity: number;
  size: string;
}

export interface Cart {
  product: Product;
  quantity: number;
}
