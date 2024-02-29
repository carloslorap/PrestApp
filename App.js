import "react-native-gesture-handler";
import "react-native-safe-area-context";
import "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/MaterialIcons"; 

import HomeScreen from "./screens/HomeScreen";
import ClientDetailsScreen from "./screens/ClientDetailsScreen";
import AddClientScreen from "./screens/AddClientScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  //headerMode="none"
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#21005D",
          tabBarInactiveTintColor: "#B5C5DA",
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
        }}
      >
        <Tab.Screen
          name="Listado de Usuarios"
          component={HomeStack}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Añadir Usuario"
          component={AddClientScreen}
          options={{
            tabBarLabel: "Añadir Usuario",
            tabBarIcon: ({ color, size }) => (
              <Icon name="person-add" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
