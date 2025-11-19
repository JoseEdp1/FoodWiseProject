import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";





export default function LaticinioScreen() {
  return (
    <View style={styles.container}>

      {/* HEADER LARANJA */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>FoodWise</Text>

        {/* espaço vazio pra alinhar */}
        <View style={styles.menuButton} />
      </View>

      {/* TÍTULO DA PÁGINA */}
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Laticínio</Text>
      </View>
        <TouchableOpacity
                      style={styles.addButton}
                    
                    >
                      <Entypo name="plus" size={32} color={"black"} />
                    </TouchableOpacity>
        
    </View>
  );
}
































const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0", // Fundo Creme
  },
  // --- Estilos do Header ---
  headerLaranja: {
    backgroundColor: "#FFB74D", // Laranja
    height: 120, 
    paddingTop: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28, 
    fontWeight: "bold",
    color: "black",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  // --- Grid de Conteúdo ---
  contentContainer: {
    padding: 20,
    marginTop: 10, 
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", 
  },
  categoryButton: {
    width: "23%", 
    alignItems: "center",
    marginBottom: 5,
    padding: 5,
  },
  iconImage: {
    width: 65,
    height: 65,
    borderRadius: 15, 
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  addButton: {
  position: "absolute",      // faz ele flutuar sobre o conteúdo
  bottom: 20,                // distância da parte de baixo da tela
  right: 20,                 // distância da lateral direita
  width: 60,                 // largura do botão
  height: 60,                // altura do botão
  borderRadius: 30,          // deixa redondo
  backgroundColor: "#ACA3A3",// cor do botão
  justifyContent: "center",  // centraliza o ícone verticalmente
  alignItems: "center",      // centraliza o ícone horizontalmente
  shadowColor: "#000",       // sombra no iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,              // sombra no Android
},
});