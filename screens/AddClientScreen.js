import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddClientScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [monto, setMonto] = useState(0);
  const [inputDate, setInputDate] = React.useState(undefined);
  const [inputDate1, setInputDate1] = React.useState(undefined);

  const handleSubmit = async () => {
    // Validar que todos los campos estén llenos
    if (!name || !lastName || !monto || !inputDate || !inputDate1) {
      Alert.alert("Error", "Por favor, complete todos los campos");
      return;
    }

    // Crear un objeto con los datos del usuario
    const user = {
      name: name,
      lastName: lastName,
      monto: monto,
      startDate: inputDate,
      endDate: inputDate1,
    };
    try {
      // Obtener la lista actual de usuarios
      const currentUsers = await AsyncStorage.getItem("users");
      let userList = currentUsers ? JSON.parse(currentUsers) : [];

      // Agregar el nuevo usuario a la lista
      userList.push(user);

      // Guardar la lista actualizada en AsyncStorage
      await AsyncStorage.setItem("users", JSON.stringify(userList));
      console.log("Usuario guardado localmente:", user);

      // Limpiar los campos del formulario
      setName("");
      setLastName("");
      setInputDate(undefined);
      setInputDate1(undefined);

      Alert.alert("Éxito", "Usuario creado correctamente");

      // Regresar al componente "Home"
      navigation.reset({
        index: 0,
        routes: [{ name: "Listado de Usuarios" }],
      });
    } catch (error) {
      console.error("Error al guardar el usuario localmente:", error);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View>
        <TextInput
          placeholder="Ingrese el nombre"
          placeholderTextColor="#C2C8D1"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Ingrese el apellido"
          placeholderTextColor="#C2C8D1"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          style={styles.input}
        />
        <TextInput
          keyboardType="number-pad"
          placeholder="Ingrese la cantidad prestada"
          placeholderTextColor="#C2C8D1"
          value={monto}
          onChangeText={(text) => setMonto(text)}
          style={styles.input}
        />
        <DatePickerInput
          locale="es"
          label="Fecha de inicio"
          animationType="slide"
          value={inputDate}
          onChange={(d) => setInputDate(d)}
          inputMode="start"
          style={styles.date}
        />
        <DatePickerInput
          locale="es"
          label="Fecha de fin"
          animationType="slide"
          value={inputDate1}
          onChange={(d) => setInputDate1(d)}
          inputMode="start"
          style={styles.date1}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Agregar Usuario
        </Button>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#EEF0F8",
  },
  input: {
    marginBottom: 12,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 150,
    borderRadius: 5,
    backgroundColor: "#21005D",
  },
  date: {
    marginTop: 55,
    borderRadius: 5,
    height: 50,
    backgroundColor: "#fff",
  },
  date1: {
    marginTop: 180,
    height: 50,
    backgroundColor: "#fff",
  },
});

export default AddClientScreen;
