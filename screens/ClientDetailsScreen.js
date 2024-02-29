import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
import {
  Modal,
  Portal,
  Button,
  PaperProvider,
  TextInput,
} from "react-native-paper";

const ClientDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedMonto, setSelectedMonto] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempMonto, setTempMonto] = useState(0);


  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    height: 170,
    margin: 30,
  };

  useEffect(() => {
    const loadSelectedDates = async () => {
      try {
        const storedDates = await AsyncStorage.getItem(
          `selectedDates_${user.name}`
        );
        if (storedDates) {
          setSelectedDates(JSON.parse(storedDates));
        }
      } catch (error) {
        console.error("Error cargando fechas seleccionadas:", error);
      }
    };

    loadSelectedDates();
  }, [user.name]);

  LocaleConfig.locales["es"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: [
      "Ene.",
      "Feb.",
      "Mar.",
      "Abr.",
      "May.",
      "Jun.",
      "Jul.",
      "Ago.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dic.",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
    today: "Hoy",
  };
  LocaleConfig.defaultLocale = "es";

  const handleDayPress = (day) => {
    console.log("Día seleccionado:", day);
    const updatedSelectedDates = { ...selectedDates };

    if (updatedSelectedDates[day.dateString]) {
      // Si la fecha ya está seleccionada, elimínala
      delete updatedSelectedDates[day.dateString];
      // También elimina el monto asociado
      delete selectedMonto[day.dateString];
    } else {
      // Si la fecha no está seleccionada, agrégala
      updatedSelectedDates[day.dateString] = true;
      // Inicializa el monto asociado a 0 si no existe
      selectedMonto[day.dateString] = selectedMonto[day.dateString] || 0;
    }

    setSelectedDates(updatedSelectedDates);
    setSelectedMonto({ ...selectedMonto });
    setSelectedDate(day.dateString);
    saveSelectedDates(updatedSelectedDates);
  };

  const saveSelectedDates = async (dates) => {
    try {
      await AsyncStorage.setItem(
        `selectedDates_${user.name}`,
        JSON.stringify(dates)
      );
      // También guarda el monto asociado
      await AsyncStorage.setItem(
        `selectedMonto_${user.name}`,
        JSON.stringify(selectedMonto)
      );
    } catch (error) {
      console.error("Error guardando fechas seleccionadas:", error);
    }
  };

  const handleDeleteDate = async (date) => {
    try {
      // Eliminar la fecha seleccionada
      const updatedSelectedDates = { ...selectedDates };
      delete updatedSelectedDates[date];
      // Actualizar el estado local
      setSelectedDates(updatedSelectedDates);
      // Guardar en AsyncStorage
      saveSelectedDates(updatedSelectedDates);
      // Mostrar un mensaje de éxito
      Alert.alert("Éxito", "Fecha eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando fecha:", error);
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const formattedDate = format(new Date(dateString), "yyyy-MM-dd");
    return formattedDate;
  };

  const saveMontoDate = async (date) => {
    showModal();
    // Obtén el monto asociado a la fecha
    const monto = selectedMonto[date] || 0;
    console.log(`Monto asociado a ${date}: ${monto}`);
    // Actualiza el estado temporal con el monto actual
    setTempMonto(monto);
  };
  

  const saveMonto = (date, monto) => {
    // Verifica que la fecha esté definida
    if (date) {
      // Actualiza el monto en el estado
      const updatedMonto = { ...selectedMonto };
      updatedMonto[date] = monto;
      setSelectedMonto(updatedMonto);
      hideModal(); // Cierra el modal después de guardar
    }
    console.log(updatedMonto);
  };

  const handleDeleteUser = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              // Obtener la lista actual de usuarios
              const currentUsers = await AsyncStorage.getItem("users");
              let userList = currentUsers ? JSON.parse(currentUsers) : [];

              // Filtrar la lista para excluir el usuario actual
              userList = userList.filter((u) => u.name !== user.name);

              // Guardar la lista actualizada en AsyncStorage
              await AsyncStorage.setItem("users", JSON.stringify(userList));

              // Después de eliminar, puedes usar reset para ir a la pantalla deseada
              navigation.reset({
                index: 0,
                routes: [{ name: "Listado de Usuarios" }],
              });
            } catch (error) {
              console.error("Error eliminando usuario:", error);
            }
          },
        },
      ]
    );
  };

  const startDate = formatDate(user.startDate);
  const endDate = formatDate(user.endDate);
  const markedDates = {};
  // Convertir startDate y endDate a objetos de fecha
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Establecer la hora a las 00:00:00 para evitar problemas de zona horaria
  startDateObj.setHours(0, 0, 0, 0);
  endDateObj.setHours(0, 0, 0, 0);

  // Iterar sobre el rango de fechas entre startDate y endDate
  let currentDate = new Date(startDateObj);

  while (currentDate <= endDateObj) {
    // Incrementar la fecha en un día
    currentDate.setDate(currentDate.getDate() + 1);
    const currentDateFormatted = formatDate(currentDate);
    markedDates[currentDateFormatted] = {
      color: "#dcddde",
      textColor: "black",
    };
  }

  // Función para convertir el objeto selectedDates en el formato esperado
  const convertSelectedDatesToMarked = () => {
    let marked = {};
    Object.keys(selectedDates).forEach((date) => {
      marked[date] = { selected: true, selectedColor: "#21005D" };
    });
    return marked;
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.body}>
        <View style={styles.containerHead}></View>
        <View style={styles.perfilImg}>
          <Image
            source={require("../assets/usuario.png")}
            style={styles.image}
          />
          <View style={styles.containUser}>
            <Text style={styles.titleUser}>
              {user.name} {user.lastName}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteUser()}>
              <Text style={styles.deleteButtonUser}>Eliminar usuario</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <Text
              style={styles.text}
            >{`Cantidad emprestada: S/.${user.monto}`}</Text>
            <Text
              style={styles.text}
            >{`Cantidad que te debe actualmente: S/.${user.monto}`}</Text>
            <Text
              style={styles.text}
            >{`La fecha de inicio que comenzaste a emprestar a ${
              user.name
            } fue el ${format(
              new Date(user.startDate),
              "d 'de' MMMM 'de' yyyy",
              {
                locale: es,
              }
            )} y su fecha de finalizacion tiene que terminar el ${format(
              new Date(user.endDate),
              "d 'de' MMMM 'de' yyyy",
              { locale: es }
            )}`}</Text>
          </View>

          <View style={styles.containFecha}>
            <Text style={styles.circleFecha}>{formatDate(user.startDate)}</Text>

            <Text style={styles.circleFecha1}>{formatDate(user.endDate)}</Text>
          </View>

          <Text style={styles.calendarHeading}>Calendario</Text>
          <Calendar
            markedDates={convertSelectedDatesToMarked()}
            onDayPress={(day) => handleDayPress(day)}
            theme={{
              selectedDayBackgroundColor: "#21005D",
              todayTextColor: "#21005D",
              arrowColor: "#21005D",
            }}
          />

          <View style={styles.selectedDatesContainer}>
            <Text style={styles.selectedDatesHeading}>
              Fechas Seleccionadas
            </Text>
            {Object.keys(selectedDates).length === 0 ? (
              <Text style={styles.selected1}>
                Aun no hay fechas seleccionadas
              </Text>
            ) : (
              <View>
                {Object.keys(selectedDates).map((date) => (
                  <View key={date} style={styles.selectedDateItem}>
                    <View style={styles.containColum}>
                      <Text style={styles.textColum}>
                        Fecha que realizó la paga
                      </Text>

                      <Text style={styles.textColum1}>
                        {format(
                          new Date(date + "T23:99:99Z"),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: es }
                        )}{" "}
                        - S/.
                      </Text>
                    </View>
                    <View style={styles.containerBoton}>
                      <TouchableOpacity onPress={() => handleDeleteDate(date)}>
                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => saveMontoDate(date)}>
                        <Text style={styles.editarButtonText}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            d
            contentContainerStyle={containerStyle}
          >
            <Text>Example Modal. Click outside this area to dismiss.</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Ingrese el nombre"
              placeholderTextColor="#C2C8D1"
              style={styles.input}
              value={tempMonto.toString()}
              onChangeText={(text) => {
                // Actualiza el monto temporalmente
                setTempMonto(parseFloat(text) || 0);
              }}
            
            />

            <Button onPress={() => saveMonto(date, tempMonto)}>Guardar</Button>
          </Modal>
        </Portal> 
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  containUser: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleFecha: {
    padding: 10,
    backgroundColor: "#21005D",
    borderRadius: 5,
    marginRight: 10,
    color: "#fff",
  },
  circleFecha1: {
    padding: 10,
    backgroundColor: "#21005D",
    borderRadius: 5,
    color: "#fff",
  },
  containFecha: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 10,
  },
  body: {
    backgroundColor: "#EEF0F8",
  },
  image: {
    width: 85,
    height: 85,
    marginTop: 40,
    marginLeft: 18,
  },
  containerHead: {
    width: "100%",
    height: 90,

    position: "absolute",
    backgroundColor: "#33018C",
  },
  container: {
    padding: 16,
  },
  titleUser: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 24,
    color: "#464E5F",
  },

  userContainer: {
    padding: 10,
  },
  text: {
    color: "#464E5F",
  },
  calendarHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginLeft: 9,
    marginBottom: 10,
    color: "#464E5F",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedDayContainer: {
    backgroundColor: "orange",
  },
  dayText: {
    color: "black",
  },
  selectedDayText: {
    color: "white",
  },
  selectedDatesContainer: {
    marginTop: 20,
  },
  textColum: {
    color: "#fff",
    fontWeight: "bold",
  },
  textColum1: {
    color: "#fff",
    marginTop: 5,
  },
  containColum: {
    flexDirection: "column",
  },
  selectedDatesHeading: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 9,
    color: "#464E5F",
  },
  selected1: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 9,
    color: "#F64E60",
  },
  selectedDateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 1, // Ancho del borde
    borderColor: "black", // Color del borde
    padding: 10, // Añad
    backgroundColor: "#2A0170",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    padding: 6,
    backgroundColor: "#F64E60",
    borderRadius: 5,
    fontWeight: "bold",
  },
  editarButtonText: {
    color: "white",
    padding: 6,
    backgroundColor: "#1BC5BD",
    borderRadius: 5,
    fontWeight: "bold",
  },
  deleteButtonUser: {
    color: "white",
    padding: 6,
    backgroundColor: "#F64E60",
    borderRadius: 5,
    fontWeight: "bold",
    marginRight: 16,
  },
  containerBoton: {
    flexDirection: "row",
    gap: 9,
  },
});

export default ClientDetailsScreen;
