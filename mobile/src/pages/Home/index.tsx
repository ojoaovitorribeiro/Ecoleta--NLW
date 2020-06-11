import React, { useState, useEffect, ChangeEvent } from "react";
import {
  View,
  Image,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Picker,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Feather as Icon } from "@expo/vector-icons";
import axios from "axios";

interface IBGECityResponse {
  nome: string;
}
interface IBGEUFResponse {
  sigla: string;
}
const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points", { uf, city });
  }

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedUf, setSeletedUf] = useState("0");
  const [selectedCity, setSeletedCity] = useState("0");

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSeletedUf(uf);
    console.log(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSeletedCity(city);
    console.log(city);
  }

  // carregar ESTADOS
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  //CARREGAR CIDADES DE ACORDO COM A UF
  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityNames = res.data.map((city) => city.nome);
        setCitys(cityNames);
      });
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ImageBackground
        style={styles.container}
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketpalce de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a enconterem pontos de coleta de forma eficiente!
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          {/* <Picker
            selectedValue={selectedUf}
            onValueChange={handleSelectedUf}
            style={{ height: 50, width: 100 }}
          >
            {ufs.map((uf) => (
              <Picker.Item label={uf} value={uf}></Picker.Item>
            ))}
          </Picker>

          <Picker
            selectedValue={selectedCity}
            onValueChange={handleSelectedCity}
            style={{ height: 50, width: 100 }}
          >
            {citys.map((city) => (
              <Picker.Item label={city} value={city}></Picker.Item>
            ))}
          </Picker> */}

          <TextInput
            style={styles.input}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            value={uf}
            onChangeText={setUf}
            placeholder="Digite a UF"
          />
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            // autoCapitalize="characters"
            autoCorrect={false}
            placeholder="Digite a cidade"
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    // fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    // fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    // fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
export default Home;
