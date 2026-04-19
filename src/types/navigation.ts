export type RootStackParamList = {
  MainTabs: undefined; 
  FactoryProduct: { brandId: number; brandName: string }; 
  ProductDetail: { productId: number };
  SearchProduct: { searchQuery: string };
  Login: undefined; 
  Register: undefined;
};