# Modul 7 TF4016 Industrial Internet of Things - Engineering Physics #
Created by: IIOT Lecture Assistant

Menyiapkan
==========
Jalankan XAMPP dengan MySQL dan phpMyAdmin
Buat / drop database iiot03
Import iiot03.sql

Menjalankan
===========
1. MQTT BROKER
MQTT broker jalan, siap menerima subscriber & publisher
```
node index.js
```

2. IOT Logger
MQTT client untuk menerima data apa saja, dan menyimpan ke Database
```
node iot_logger.js
```

3. IOT SIMULATOR
Akan menjalankan simulator 16 node yang mengirim data setiap 1 detik
```
node iot_simulator.js
```
