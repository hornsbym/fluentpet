import React, { createContext, useState, useContext } from "react";
import { Pet, PetOperationResponse } from "../types";

type PetContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => PetOperationResponse;
  updatePet: (pet: Pet) => PetOperationResponse;
  deletePet: (id: string) => void;
  searchPets: (query: string) => Pet[];
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);

  const addPet = (newPet: Pet): PetOperationResponse => {
    // Prevent duplicate names:
    const nameFilteredPets = pets.filter((existingPet) => existingPet.name.toUpperCase() === newPet.name.toUpperCase()
    )

    if (nameFilteredPets.length > 0) return {
      success: false,
      message: "Pet names must be unique"
    }

    setPets([...pets, newPet]);

    return {
      success: true
    }

  };

  const updatePet = (updatedPet: Pet): PetOperationResponse => {
    const newPets = pets.map((pet) => {
      if (pet.id === updatedPet.id) {
        return updatedPet;
      }
      return pet;
    });
    setPets(newPets);
    return {
      success: true
    }
  };

  const deletePet = (id: string) => {
    setPets(pets.filter((pet) => pet.id !== id));
  };

  // TODO: Implement search functionality
  const searchPets = (searchName: string) => {
    return pets.filter((pet) => pet.name.toUpperCase().includes(searchName.toUpperCase()))
  };

  return (
    <PetContext.Provider
      value={{ pets, addPet, updatePet, deletePet, searchPets }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return context;
};
