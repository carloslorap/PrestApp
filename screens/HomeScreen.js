import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
          setFilteredUsers(parsedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = users.filter((user) =>
      `${user.name} ${user.lastName}`.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserPress = (user) => {
    // Navegar a la pantalla de detalles y pasar la información del usuario
    navigation.navigate("ClientDetails", { user });
  };
  const CustomButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Searchbar
        placeholder="Buscar..."
        placeholderTextColor="#C2C8D1"
        onChangeText={handleSearch}
        value={searchTerm}
        style={styles.searchBar}
      />
      <View style={styles.headerTopBar}>
        <Text style={styles.headerTopBarText}>Usuarios</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.heading}>Nombre</Text>
        <Text style={styles.heading}>Apellido</Text>
        <Text style={styles.heading}>Monto</Text>
        <Text style={styles.heading}>Info</Text>
      </View>
      <ScrollView>
        {filteredUsers.length == 0 ? (
          <Text style={styles.selected1}>Aun no hay usuarios registrados</Text>
        ) : (
          filteredUsers.map((user, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{user.name}</Text>
              <Text style={styles.cell}> {user.lastName}</Text>
              <Text style={styles.cell}>S/.{user.monto}</Text>
              <CustomButton
                title="Ver Detalles"
                onPress={() => handleUserPress(user)}
              />
            </View>
          ))
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0F8",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTopBar: {
    backgroundColor: "#21005D",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 15,
  },
  headerTopBarText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  heading: {
    flex: 1,
    color: "#464E5F",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#EEF0F8",
  },
  cell: {
    textAlign: "left",
    flex: 1,
    color: "#464E5F",
  },
  buttonContainer: {
    backgroundColor: "#21005D",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
    padding: 10,
  },
  notify: {
    zIndex: 1000000,
    position: "absolute",
    color: "#464E5F",
  },
  selected1: {
    display: "flex",
    textAlign: "center",
    marginTop: 20,
    fontSize: 17,
    color: "#464E5F",
  },
  searchBarContainer: {
    marginBottom: 10,
  },
  searchBar: {
    borderColor: "#21005D",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: 50,
  },
});

export default HomeScreen;
