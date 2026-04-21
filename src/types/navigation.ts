export type RootStackParamList = {
  MainTabs: { screen: string } | undefined;
  FactoryProduct: { brandId: number; brandName: string }; 
  ProductDetail: { productId: number };
  SearchProduct: { searchQuery: string };
  Login: undefined; 
  Register: undefined;
  Cart: undefined;
};