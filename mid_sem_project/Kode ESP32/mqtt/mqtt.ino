#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "DHT.h"
#define DHTPIN 13
#define LDRPIN 34
#define redPin 27
#define greenPin 26
#define bluePin 25
#define LEDPIN 14
#define LEDPINTombol 33

//deklarasi objek dht
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Alamat Wifi
const char* ssid = "Erlant";
const char* password = "erlant123";

// alamat broker
const char* mqtt_server = "192.168.43.62";

// Deklarasi Variabel Global
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
float t = 0;
float h = 0;
float b = 0;
float subTemp = 0;
float subHum = 0;
float subBright = 0;
int ledMode = 0;

//freq, resolution, ledchannel buat analog output esp32
const int freq = 5000;
const int resolution = 8; // resolusi 8 bit buat rgb, 0 - 255
const int ledChannelRed = 0;
const int ledChannelGreen = 1;
const int ledChannelBlue = 2;
float batasHum = 0;
float batasTemp = 0;
float batasBright = 0;
int sliderRed = 0;
int sliderGreen = 0;
int sliderBlue = 0;
int ledStatus = 0;

// fungsi buat updateLED RGB, buat mode otomatis jika nilai lebih dari threshold, LED nyala sesuai ketentuan
void updateLED(float temp, float hum, float bright) {
  if (temp >= batasTemp) {
    ledcWrite(ledChannelRed, 255);
  }
  else {
    ledcWrite(ledChannelRed, 0);
  }

  if (hum >= batasHum) {
    ledcWrite(ledChannelGreen, 255);
  }
  else {
    ledcWrite(ledChannelGreen, 0);
  }

  if (bright >= batasBright) {
    ledcWrite(ledChannelBlue, 255);
  }
  else {
    ledcWrite(ledChannelBlue, 0);
  }

  if (temp >= batasTemp || hum >= batasHum || bright >= batasBright) {
    digitalWrite(LEDPIN, HIGH);
  }
  else {
    digitalWrite(LEDPIN, LOW);
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  pinMode(LEDPIN, OUTPUT);
  pinMode(LEDPINTombol, OUTPUT);

  //setting pin buat output PWM
  ledcSetup(ledChannelRed, freq, resolution);
  ledcSetup(ledChannelGreen, freq, resolution);
  ledcSetup(ledChannelBlue, freq, resolution);
  ledcAttachPin(redPin, ledChannelRed);
  ledcAttachPin(greenPin, ledChannelGreen);
  ledcAttachPin(bluePin, ledChannelBlue);
}

//fungsi untuk mengkoneksikan esp32 dengan access point
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    //Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  
  // pemilahan pesan yang diterima dari broker sesuai topik pesan
  if (String(topic) == "topic/humidity") {
    subHum = messageTemp.toFloat();
    Serial.print(subHum);
  }

  else if (String(topic) == "topic/temperature") {
    subTemp = messageTemp.toFloat();
    Serial.print(subTemp);
  }

  else if (String(topic) == "topic/brightness") {
    subBright = messageTemp.toFloat();
    Serial.print(subBright);
  }
  else if (String(topic) == "topic/ledmode") {
    ledMode = messageTemp.toInt();
    Serial.print(ledMode);
  }
  else if (String(topic) == "topic/batashum") {
    batasHum = messageTemp.toFloat();
    Serial.print(batasHum);
  }
  else if (String(topic) == "topic/batastemp") {
    batasTemp = messageTemp.toFloat();
    Serial.print(batasTemp);
  }
  else if (String(topic) == "topic/batasbright") {
    batasBright = messageTemp.toFloat();
    Serial.print(batasBright);
  }
  else if (String(topic) == "topic/sliderred") {
    sliderRed = messageTemp.toInt();
    Serial.print(sliderRed);
  }
  else if (String(topic) == "topic/slidergreen") {
    sliderGreen = messageTemp.toInt();
    Serial.print(sliderGreen);
  }
  else if (String(topic) == "topic/sliderblue") {
    sliderBlue = messageTemp.toInt();
    Serial.print(sliderBlue);
  }

  else if (String(topic) == "topic/ledstatus") {
    ledStatus = messageTemp.toInt();
    Serial.print(ledStatus);
  }


  //jika mode otomatis, led digital menyala jika ada salah satu nilai yang melebihi ambang, 
  //led rgb menyala jika nilai melebihi ambang batas sesuai warna tertentu
  if (ledMode == 1) {
    updateLED(subTemp, subHum, subBright);
  }

  //jika mode manual, led digital dinyalakan jika tombol ditekan
  // rgb menyala sesuai nilai slider
  else {
    if (ledStatus == 1) {
      digitalWrite(LEDPIN, HIGH);
    }
    else {
      digitalWrite(LEDPIN, LOW);
    }
    digitalWrite(LEDPINTombol, HIGH);
    ledcWrite(ledChannelRed, sliderRed);
    ledcWrite(ledChannelGreen, sliderGreen);
    ledcWrite(ledChannelBlue, sliderBlue);
  }
  Serial.println();
}

// fungsi jika esp32 putus koneksi dan ingin menyambung kembali koneksi
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP32")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("topic/humidity");
      client.subscribe("topic/temperature");
      client.subscribe("topic/brightness");
      client.subscribe("topic/ledmode");
      client.subscribe("topic/batashum");
      client.subscribe("topic/batastemp");
      client.subscribe("topic/batasbright");
      client.subscribe("topic/sliderred");
      client.subscribe("topic/slidergreen");
      client.subscribe("topic/sliderblue");
      client.subscribe("topic/ledstatus");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  // looping untuk fungsi callback
  client.loop();


  //looping untuk membaca nilai sensor suhu, kelembaban, dan intensitas cahaya
  // looping dilakukan setiap 0.2 sekon
  long now = millis();
  if (now - lastMsg > 200) {
    lastMsg = now;

    // membaca suhu dan kelembaban dari dht
    t = dht.readTemperature();
    h = dht.readHumidity();

    //membaca nilai intensitas cahaya dengan kalibrasi
    b =  2.16 * analogRead(LDRPIN) + 1154.12;

    // sensor akan mempublish nilai suhu, kelembaban, dan intensitas cahaya jika nilainya tidak nan,
    // yaitu jika sensor berhasil bekerja
    if (isnan(t) || isnan(h) || isnan(b)) {
      Serial.println("Failed to read from DHT");
    }

    else {
     
      char humString[50];
      //mengubah string ke buffer untuk di publish
      snprintf(humString, 50, "%.2f", h);
      //Serial.print("Humidity: ");
      //Serial.println(humString);
      // publish nilai
      client.publish("topic/humidity", humString);

      // Convert the value to a char array
      char tempString[50];
      snprintf(tempString, 50, "%.2f", t);
      //Serial.print("Temperature: ");
      //Serial.println(tempString);
      client.publish("topic/temperature", tempString);


      char brightString[50];
      snprintf(brightString, 50, "%.2f", b);
      Serial.print("Brightness: ");
      Serial.println(brightString);
      client.publish("topic/brightness", brightString);
    }
  }
}
