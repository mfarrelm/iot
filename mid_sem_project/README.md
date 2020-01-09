1. Deskripsi tugas yang dibuat
	
	Sistem IoT yang dibuat bekerja dengan baik, berjalan dengan lancar, dan tidak ada bug. Ketika diintegrasikan dengan ESP32 untuk pengambilan data menggunakan sensor yaitu sensor DHT11 dan sensor LDR,
Output dari sensor terbaca pada Web Dashboard berupa gauge berupa nilai aktual dari temperature, humidity, dan brightness dengan kalibrasi pada brightness agar sesuai pada datasheet beserta kenaikan/penurunannya 
dan data dapat diupdate serta ditampilkan pada grafik dengan waktu update setiap 1 detik. Selain itu, data yang telah diakuisisi oleh ESP32 dirata-ratakan dengan menggunakan metode exponentially weighted moving average 
dan ditampilkan juga pada Web. Digunakan juga LED dan LED RGB dengan terdapat tombol pada rangkaian berupa push button dan button pada dashboard untuk menyalakan dan mematikan LED pada mode manual, serta terdapat slider 
pada web dashboard untuk mengatur nilai RGB sehingga muncul cahaya LED RGB sesuai konfigurasinya. Jika digunakan mode otomatis, terdapat alarm yang menandakan apakah data yang terbaca oleh sensor melebihi threshold yang 
ditentukan atau tidak. Kelebihan dari sistem ini adalah terdapat threshold yang dapat diatur pada setiap besaran fisis yang diukur, terdapat 3 threshold yang nilainya masing-masing dapat diukur besarnya. Alarmnya berupa 
LED RGB dan 3 buah LED pada web, jika ada besaran fisis yang melebihi threshold, maka LED pada web berubah dari warna hijau ke warna merah, dan pada rangkaian LED RGBnya akan berubah menjadi warna merah/hijau/biru sesuai 
dengan besaran fisisnya, setiap besaran fisis memiliki output LED yang berbeda.

2. Komponen-komponen elektronik yang digunakan pada rangkaian IoT Node yaitu:

	Breadboard, ESP32, Sensor DHT11, Sensor LDR, push button, LED, LED RGB, jumper, dan resistor.

3. Cara menjalankan kode-kode IoT Server, IoT Client, dan IoT Node:

	1. Buka terminal, arahkan pada direktori yang berisi file-file yang berisi kodenya  
	2. Untuk menjalankan IoT Server beserta IoT Client, ketikan node mqtt.js, jika Address IoT Server dan IoT
	Client berbeda, maka disamakan terlebih dahulu sesuai dengan IP Address koneksiyang digunakan
	3. Untuk menjalankan IoT Node, buka program arduino melalui terminal kemudian compile dan upload kode ke ESP 32

4. Kontribusi dan Anggota Kelompok

	1. Erlant Muhammad Khalfani 	(13317025) - Membuat rangkaian pada breadboard
	2. Muhammad Farrel Mahendra 	(13317027) - Membuat kode javascript dan node, membuat rangkaian pada breadboard, mendesain HTML dan CSS untuk website
	3. Naufal Dzaki Hafizhan	(13317037) - Mendesain HTML dan CSS untuk website

