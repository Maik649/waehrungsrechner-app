import React from "react";
import { TouchableOpacity, Image,Text, View, TextInput, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Picker } from '@react-native-picker/picker';

export default function WechselkursButton() {
  const [kurs, setKurs] = React.useState<number | null>(null);
  const [betrag, setBetrag] = React.useState("");
  const [euro, setEuro] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("NOK");

  React.useEffect(() => {
    fetchWechselkurs(selectedCurrency);
    setBetrag("");
    setEuro("");
  }, [selectedCurrency]);

  async function fetchWechselkurs(currency: string) {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_fUb3F2xiHD8CZJyL0bRLWZ6tq9B3kSKbdWDNc6GB&currencies=EUR&base_currency=${currency}`
    );
    const data = await response.json();
    if (!data.data || !data.data.EUR) {
      alert("Wechselkurs konnte nicht geladen werden!");
      setKurs(null);
      return;
    }
    setKurs(data.data.EUR);
  }

  function handleUmrechnen() {
    if (kurs && betrag) {
      setEuro((parseFloat(betrag) * kurs).toFixed(2));
    }
  }

  return (
    <View style={styles.layaut}>
    <Stack.Screen
        options={{
          
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
     
      <Image
        source={require("../assets/images/kreisel.png")}
        style={{ marginRight: 25, width: 40, height: 40, resizeMode: "contain" }}
      />
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          Währungsrechner
        </Text>
        </View>
    ),
         
          headerStyle: { backgroundColor: '#007BFF' },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />,
    <View style={styles.container}>
     

     <View
  style={{
     borderStyle: 'solid',
      borderWidth: 1,
      borderColor: "#A9A9A9",
      borderRadius: 4,
      height: 45,
      width: 250,
      marginBottom: 10,
      justifyContent: "center",
      backgroundColor: "#fff"
    
  }}
> <Text style={{marginLeft: 35, marginBottom:-25, marginTop:5, fontWeight: "bold" }}>Währung auswählen</Text>
  <Picker
   
    selectedValue={selectedCurrency}
    style={{
      height: 35,
      width: 240,
     
      }}
    onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
  > 
    <Picker.Item label="Norwegische Krone" value="NOK" />
    <Picker.Item label="US Dollar" value="USD" />
    <Picker.Item label="Kanadischer Dollar" value="CAD" />
  </Picker>
</View>
      {kurs && (
        <View>
          <Text style={styles.headline}>Aktueller Wechselkurs:</Text>
          <Text style={styles.resultText}>
            1 {selectedCurrency} = {kurs.toFixed(4)} EUR
          </Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder={`${selectedCurrency} eingeben`}
        value={betrag}
         onChangeText={text => setBetrag(text.replace(",", "."))}
      />
    <TouchableOpacity
  onPress={handleUmrechnen}
  disabled={!kurs || !betrag}
  style={{
    backgroundColor: (!kurs || !betrag) ? "#ccc" : "#007BFF",
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center"
  }}
>
  <Image
    source={require("../assets/images/kreisel.png")} // Passe den Pfad zu deinem Bild an!
    style={{ width: 32, height: 32, tintColor: "#fff" }}
  />
</TouchableOpacity>
      {euro !== "" && (
        <Text style={styles.resultText}>
          {betrag} {selectedCurrency} = {euro} EUR
        </Text>
      )}
    </View>
    </View>

  );
}

const styles = StyleSheet.create({
    layaut:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  container: {
   
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 25,
    gap: 5,
    width:'100%',
    height: '100%',
    backgroundColor: "#bab5b5"
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 5,
    width: 200,
    marginVertical: 10,
    textAlign: "center"
  },
  resultText: {
    margin: 10,
    fontSize: 16,
  },
  headline:{
     fontWeight: "bold", 
     fontSize: 16, 
     marginTop: 10 
  },
  taskItem: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#333"
  }
});
