import React from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCurrency}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
      >
        <Picker.Item label="Norwegische Krone (NOK)" value="NOK" />
        <Picker.Item label="US Dollar (USD)" value="USD" />
        <Picker.Item label="Kanadischer Dollar (CAD)" value="CAD" />
      </Picker>
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
        onChangeText={setBetrag}
      />
      <Button
        title="In Euro umrechnen"
        onPress={handleUmrechnen}
        disabled={!kurs || !betrag}
      />
      {euro !== "" && (
        <Text style={styles.resultText}>
          {betrag} {selectedCurrency} = {euro} EUR
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 25,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    width: 200,
    marginVertical: 10,
    textAlign: "center"
  },
  resultText: {
    margin: 10,
    fontSize: 16,
  },
  headline:{
     fontWeight: "bold", fontSize: 16, marginTop: 10 
  },
  taskItem: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#333"
  }
});