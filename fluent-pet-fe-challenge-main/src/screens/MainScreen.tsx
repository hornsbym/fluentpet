import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { usePetContext } from "../context/PetContext";
import { Pet, PetOperationResponse } from "../types";
import { PetCategories } from "../constants";

type FieldErrorMessages = {
  name: string,
  age: string,
  description: string
}

const SpeciesOptions = PetCategories.map((category) => category.category)

const MainScreen: React.FC = () => {
  const { addPet, updatePet, deletePet, searchPets, pets } = usePetContext();
  // Add/update fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')

  // Search fields
  const [searchName, setSearchName] = useState("");

  const [editingPet, setEditingPet] = useState<Pet>();
  const [fieldErrorMessages, setFieldMessages] = useState<FieldErrorMessages>({
    name: '',
    age: '',
    description: ''
  })
  const [formErrorMessage, setFormErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    // Any time you switch from editing to adding,
    // clear the fields
    if (!editingPet) clearFields()
  }, [editingPet])

  const handleSubmit = () => {
    if (validateFields()) {
      const petData: Pet = {
        id: editingPet?.id || Date.now().toString(),
        name,
        age,
        description,
      };

      let res: PetOperationResponse
      if (editingPet) {
        res = updatePet(petData);
        if (res.success) {
          setEditingPet(undefined)
        }
      } else {
        res = addPet(petData);
        if (res.success) clearFields()
      }
      setFormErrorMessage(res.message)
    }
  };

  const renderPetItem = ({ item }: { item: any }) => (
    <View style={styles.petItem}>
      <Text>Name: {item.name}</Text>
      <Text>Age: {item.age}</Text>
      {item.description && <Text>Description: {item.description}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setEditingPet(item);
            setName(item.name);
            setAge(item.age);
            setDescription(item.description || "");
          }}
          style={styles.editButton}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deletePet(item.id)}
          style={styles.deleteButton}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const clearFields = () => {
    setName("")
    setAge("")
    setDescription("")
  }

  const validateFields = (): boolean => {
    const newFieldErrorMessages: FieldErrorMessages = {
      name: '',
      age: '',
      description: ''
    }
    let isValid = true
    if (name === '') {
      newFieldErrorMessages.name = 'Name field is required.'
      isValid = false
    }
    if (age === '') {
      newFieldErrorMessages.age = 'Age field is required.'

      isValid = false
    }
    if (description === '') {
      newFieldErrorMessages.description = 'Description field is required.'
      isValid = false
    }

    setFieldMessages(newFieldErrorMessages)

    return isValid
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {editingPet ? "Updating a Pet" : "Create a New Pet"}
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text>
            {`Pet name *`}
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Pet Name"
          />
          {
            fieldErrorMessages.name && <Text style={styles.errorMessage}>
              {fieldErrorMessages.name}
            </Text>
          }
        </View>
        <View style={styles.inputContainer}>
          <Text>
            {`Pet age (in years) *`}
          </Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={(age) => setAge(age.replace(/[^0-9]/g, ''))} // https://stackoverflow.com/a/47751269
            placeholder="Pet Age"
            keyboardType="numeric"
          />
          {
            fieldErrorMessages.age && <Text style={styles.errorMessage}>
              {fieldErrorMessages.age}
            </Text>
          }
        </View>
        <View style={styles.inputContainer}>
          <Text>
            {`Pet description *`}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Pet Description"
            multiline
            numberOfLines={4}
          />
          {
            fieldErrorMessages.description && <Text style={styles.errorMessage}>
              {fieldErrorMessages.description}
            </Text>
          }
        </View>
        <View style={styles.inputContainer}>
          <Text>
            {`Pet species`}
          </Text>

          {
            // Intended to be drop-down or radio field, ran out of time
            SpeciesOptions.map((species) => <TouchableOpacity style={styles.speciesButton} onPress={() => setSpecies(species)}>
              <Text>
                {species}
              </Text>
            </TouchableOpacity>)
          }
        </View>
        {
          species && (
            <View style={styles.inputContainer}>
              <Text>
                {`Pet species`}
              </Text>

              {
                // Intended to be drop-down or radio field, ran out of time
                PetCategories.filter((category) => category.category === species)[0].breeds?.map((breed) => <TouchableOpacity style={styles.speciesButton} onPress={() => setBreed(breed)}>
                  <Text>
                    {breed}
                  </Text>
                </TouchableOpacity>)
              }
            </View>

          )
        }
        <Text style={{ marginBottom: 8 }}>
          {"* Indicates a required field"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {editingPet ? "Update Pet" : "Add Pet"}
          </Text>
        </TouchableOpacity>
        {editingPet && <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setEditingPet(undefined)}
        >
          <Text style={styles.buttonText}>
            {"Cancel Update"}
          </Text>
        </TouchableOpacity>}

        {
          formErrorMessage && <Text style={styles.errorMessage}>
            {formErrorMessage}
          </Text>
        }
      </View>

      <View style={styles.listContainer}>
        {/* Search function */}
        <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', maxHeight: 36, minWidth: 96 }]}>
          <Text>
            {`Search by name:`}
          </Text>
          <TextInput
            style={[styles.input]}
            placeholder="Enter your pet's name"
            value={searchName}
            onChangeText={setSearchName}
            multiline
            numberOfLines={4}
          />
        </View>

        <FlatList
          data={searchName === '' ? pets : searchPets(searchName)}
          keyExtractor={(item) => item.id}
          renderItem={renderPetItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  errorMessage: {
    color: 'red'
  },
  formContainer: {
    padding: 16,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: "column",
    gap: 2,
    marginBottom: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  headerText: {
    display: 'flex',
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 24
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 5,
  },
  speciesButton: {
    backgroundColor: '#dddddd',
    padding: 8,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  petItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
});

export default MainScreen;
