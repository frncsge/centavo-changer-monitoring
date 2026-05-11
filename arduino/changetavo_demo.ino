#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // make sure to download this library in Arduino IDE 

// MACHINE CONFIG
const int machine_id = 8;

// wifi name and password
const char* ssid = "AmoncioFamily";
const char* password = "Amoncio992004";

// url of the server API (im using the IP address of my laptop which is also connected to the same wifi)
const char* api_url = "http://192.168.100.211:3000/api/transactions";

// SAMPLE DATA
const int centavos = 132;

struct DispensedCoin {
  int peso_value;
  int quantity;
};

DispensedCoin dispensedCoins[] = {
  {10, 2},
  {5, 2},
  {1, 3}
};

void setup() {
  Serial.begin(115200);  // baud rate
  delay(2000);

  // connect to wifi
  if (!connectToWifi()) {
    Serial.println("WiFi connection failed. Will retry later");
  }

  // if connected, create the transaction data in json format
  String jsonData = createJsonData();

  // send the data to the backend API
  bool success = sendTransaction(jsonData);

  if (!success) {
    Serial.println("Transaction failed");
  }
}

void loop() {}

bool connectToWifi() {
  // initialize wifi connection
  WiFi.begin(ssid, password);

  int attempts = 0;
  const int maxAttempts = 10;

  while(WiFi.status() != WL_CONNECTED && attempts < maxAttempts) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    return true;
  } 

  return false;
}

String createJsonData() {
  // declare size of the JSON document
  StaticJsonDocument<1024> doc;

  // create data object
  JsonObject data = doc["data"].to<JsonObject>();

  data["machine_id"] = machine_id;
  data["event_id"] = generateEventId();
  data["centavos"] = centavos;

  // create array
  JsonArray dispensed = data["dispensed"].to<JsonArray>();

  int dispensedCount = sizeof(dispensedCoins) / sizeof(dispensedCoins[0]);

  // add objects to the array
  for (int i = 0; i < dispensedCount; i++) {
    JsonObject item = dispensed.add<JsonObject>();
    item["peso_value"] = dispensedCoins[i].peso_value;
    item["quantity"] = dispensedCoins[i].quantity;
  }

  // convert Json doc into string
  String jsonData;
  serializeJson(doc, jsonData);

  return jsonData;
}

bool sendTransaction(String jsonData) {
  HTTPClient http;

  http.begin(api_url);
  http.addHeader("Content-Type", "application/json");

  Serial.println("Sending JSON:");
  Serial.println(jsonData);

  // send JSON to server API
  int httpResponseCode = http.POST(jsonData);

  Serial.print("HTTP Response code:");
  Serial.println(httpResponseCode);

  if (httpResponseCode <= 0) {
    Serial.println("Connection error");
    http.end();
    return false;
  }

  String response = http.getString();
  Serial.println("Server response:");
  Serial.println(response);

  switch (httpResponseCode) {
    case 200:
    case 201:
      Serial.println("Transaction sent successfully!");
      http.end();
      return true;
    
    case 400:
      Serial.println("Something is wrong with the JSON data");
      break;

    case 401:
      Serial.println("Unauthorized request");
      break;

    case 404:
      Serial.println("API route not found");
      break;

    default:
      if (httpResponseCode >= 500) {
        Serial.println("Server error");
      } else {
        Serial.println("Unexpected response");
      }
      break;
  }

  http.end();
  return false;
}

String generateEventId() {
  long randomNum = random(1000, 9999);

  String eventId = 
    String(machine_id) + "-" +
    String(millis()) + "-" + 
    String(randomNum);

  return eventId;
}