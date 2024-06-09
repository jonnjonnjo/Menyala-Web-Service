<div align="center">
    <h1>Tugas Besar</h1>
    <h3>II3240 - System Engineering</h3>
    <h4>Kelompok 2</h4>
    <h5>Web Services</h5>
</div>
<br>

<div align="center">
    <img src="https://readme-typing-svg.herokuapp.com?font=Itim&size=48&pause=1000&color=660B0B&center=true&vCenter=true&random=false&width=1000&height=60&lines=MENYALA%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5" alt="Menyala🔥🔥🔥">
</div>

## Description

Sistem ini merupakan web services dari ![Menyala](https://github.com/frendysanusi/menyala).

## Group's Members

<table>
    <tr align="center">
        <th>No.</th>
        <th>Nama</th>
        <th>NIM</th>
    </tr>
    <tr>
        <td>1.</td>
        <td>Frendy Sanusi</td>
        <td>18221041</td>
    </tr>
    <tr>
        <td>2.</td>
        <td>Fawwaz Abrial Saffa</td>
        <td>18221067</td>
    </tr>
    <tr>
        <td>3.</td>
        <td>Jonathan Arthurito Aldi Sinaga</td>
        <td>18221079</td>
    </tr>
    <tr>
        <td>4.</td>
        <td>Rasyadan Faza Safiqur Rahman</td>
        <td>18221103</td>
    </tr>
    <tr>
        <td>5.</td>
        <td>Hugo Benedicto Tanidi</td>
        <td>18221131</td>
    </tr>
</table>

## Tech Stack

- Express v4.19.2
- Typescript v5.4.5
- Supabase

## How to Run
1. Clone respository ini

2. Masuk ke directory

```
cd /Menyala-Web-Service
```

3. Buat file .env dengan template berikut
```
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT=
PORT=8012
```

4. Jalankan aplikasi menggunakan command berikut

```
npm install
npm run start
```

5. Aplikasi akan berjalan pada port yang diberikan oleh console anda. Web Service akan run pada http://localhost:8012

## List of API Endpoint
| No  | HTTP Method | URL       | Description                          |
| --- | ----------- | --------- | ------------------------------------ |
| 1   | POST        | /iot/iot-cam     | Mengirim data gambar dari IoT ke database    |
| 2   | POST         | /iot/iot-gas-temperature | Mengirim data asap dan temperatur dari IoT ke database |
| 3   | GET        | /iot/data | Menampilkan array of data dari temperature, cam, dan gas |
| 4   | POST         | /user/login | Melakukan login akun |
| 5   | POST      | /user/register | Melakukan registrasi akun |
