#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#define LDRPIN 34
#define redPin 27
#define greenPin 26
#define bluePin 25
#define LEDPIN 14

// Alamat Wifi
const char* ssid = "GRAHA_PESONA_No_A4";
const char* password = "27021969";
// Set your Static IP address
//IPAddress local_IP(192, 168, 1, 207);
// Set your Gateway IP address
//IPAddress gateway(192, 168, 1, 1);

//IPAddress subnet(255, 255, 255, 0);
//IPAddress primaryDNS(8, 8, 8, 8);   //optional
//IPAddress secondaryDNS(8, 8, 4, 4); //optional
// alamat broker
const char* mqtt_server = "192.168.100.73";

// Deklarasi Variabel Global
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;

//freq, resolution, ledchannel buat analog output esp32
const int freq = 5000;
const int resolution = 8; // resolusi 8 bit buat rgb, 0 - 255
const int ledChannelRed = 0;
const int ledChannelGreen = 1;
const int ledChannelBlue = 2;

//Nilai dari hmi, hasil subscribe
int YS = 0; //YS ini MODE dari arduino, manual = 0, otomatis = 1
int DVR = 0; //DVR digital value red
int DVG = 0; //DVG digital value green
int DVB = 0; //DVB digital value blue
int CC = 0; //CC Set point untuk ambang batas, kalo pembacaan sensor(CT) lebih besar
//Dan YS = 1, LED RGB menyala

//Nilai dari node, akan di publish
float CT = 0; //CT hasil pembacaan sensor brightness

void updateLED(float CC, float DVR, float DVG, float DVB) {
  if (CC > CT) {
    ledcWrite(ledChannelRed, DVR);
    ledcWrite(ledChannelGreen, DVG);
    ledcWrite(ledChannelBlue, DVB);
  }
  else {
    ledcWrite(ledChannelRed, 0);
    ledcWrite(ledChannelGreen, 0);
    ledcWrite(ledChannelBlue, 0);
  }
}
void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  pinMode(LEDPIN, OUTPUT);

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
   // Configures static IP address
  //if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
  //  Serial.println("STA Failed to configure");
  //}
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
  if (String(topic) == "TF-IIOT/NODE07/YS/071") {
    YS = messageTemp.toInt();
    Serial.print(YS);
  }
  else if (String(topic) == "TF-IIOT/NODE07/DVR/071") {
    DVR = messageTemp.toFloat();
    Serial.print(DVR);
  }
  else if (String(topic) == "TF-IIOT/NODE07/DVG/071") {
    DVG = messageTemp.toFloat();
    Serial.print(DVG);
  }
  else if (String(topic) == "TF-IIOT/NODE07/DVB/071") {
    DVB = messageTemp.toFloat();
    Serial.print(DVB);
  }
  else if (String(topic) == "TF-IIOT/NODE07/CC/071") {
    CC = messageTemp.toFloat();
    Serial.print(CC);
  }




  //jika mode otomatis, led digital menyala jika ada salah satu nilai yang melebihi ambang,
  //led rgb menyala jika nilai melebihi ambang batas sesuai warna tertentu
  if (YS == 1) {
    updateLED(CC, DVR, DVG, DVB);
  }

  //jika mode manual, led digital dinyalakan jika tombol ditekan
  // rgb menyala sesuai nilai slider
  else {
    ledcWrite(ledChannelRed, DVR);
    ledcWrite(ledChannelGreen, DVG);
    ledcWrite(ledChannelBlue, DVB);
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
      client.subscribe("TF-IIOT/NODE07/YS/071");
      client.subscribe("TF-IIOT/NODE07/DVR/071");
      client.subscribe("TF-IIOT/NODE07/DVG/071");
      client.subscribe("TF-IIOT/NODE07/DVB/071");
      client.subscribe("TF-IIOT/NODE07/CC/071");

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

  //looping untuk intensitas cahaya
  // looping dilakukan setiap 0.2 sekon
  long now = millis();
  if (now - lastMsg > 200) {
    lastMsg = now;

    //membaca nilai intensitas cahaya dengan kalibrasi
    CT =  2.16 * analogRead(LDRPIN) + 1000;

    // sensor akan mempublish nilai suhu, kelembaban, dan intensitas cahaya jika nilainya tidak nan,
    // yaitu jika sensor berhasil bekerja
    if (isnan(CT)) {
      Serial.println("Failed to read from LDR");
    }

    else {
      char CTString[50];
      snprintf(CTString, 50, "%.2f", CT);
      //Serial.print("Brightness: ");
      //Serial.println(CTString);
      client.publish("TF-IIOT/NODE07/CT/071", CTString);

      char DIRString[50];
      snprintf(DIRString, 50, "%i", DVR);
      client.publish("TF-IIOT/NODE07/DIR/071", DIRString);

      char DIGString[50];
      snprintf(DIGString, 50, "%i", DVG);
      client.publish("TF-IIOT/NODE07/DIG/071", DIGString);

      char DIBString[50];
      snprintf(DIBString, 50, "%i", DVB);
      client.publish("TF-IIOT/NODE07/DIB/071", DIBString);

      char YIString[50];
      snprintf(YIString, 50, "%i", YS);
      client.publish("TF-IIOT/NODE07/YI/071", YIString);
    }
  }
}
