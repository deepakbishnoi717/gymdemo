export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specs: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'trainer';
  text: string;
  timestamp: Date;
}

export interface EnquiryData {
  name: string;
  goal: string;
  whatsapp: string;
}

export interface CarouselItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
}
