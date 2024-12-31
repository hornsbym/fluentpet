export type Pet = {
  id: string;
  name: string;
  age: string;
  petCategory?: PetCategory,
  image?: string;
  description?: string;
};

export type RootStackParamList = {
  Main: undefined;
};

export type PetOperationResponse = {
  success: boolean,
  message?: string
}

export type PetCategory = {
  category: string,
  breeds?: string[]
}