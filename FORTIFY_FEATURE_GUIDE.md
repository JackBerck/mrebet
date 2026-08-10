# Panduan Pengaturan Fitur Otentikasi Fortify (2FA, Registrasi, Passkeys)

Dokumen ini menjelaskan cara mengaktifkan atau mematikan fitur Fortify (Registrasi Publik, 2FA, Passkeys, Reset Password) tanpa merusak build Wayfinder (`npm run build`).

---

## 1. Tidak Ada Breaking Changes

- **Sistem berjalan 100% normal.**
- Pengunjung publik tidak bisa mengakses rute registrasi/2FA (diarahkan ke `404 Not Found` oleh stub routes).
- Admin & pengguna terdaftar tetap dapat login seperti biasa melalui `/login` dan mengakses `/admin/dashboard`.

---

## 2. Cara Mengaktifkan Kembali (Enable Fortify Features)

Jika suatu saat Anda ingin **membuka registrasi publik, 2FA, atau Passkeys**:

### Langkah 1: Edit `config/fortify.php`
Buka file `config/fortify.php` dan **uncomment** fitur yang ingin diaktifkan pada bagian `'features'`:

```php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
    Features::passkeys([
        'confirmPassword' => true,
    ]),
],
```

### Langkah 2: Hapus / Comment Stub Routes di `routes/web.php`
Buka `routes/web.php`, lalu **hapus atau comment** bagian stub routes di paling bawah file:

```php
// Hapus atau comment baris berikut saat fitur Fortify diaktifkan kembali:
// Route::name('register')->get('/register', fn () => abort(404));
// ...
```

### Langkah 3: Regenerasi Rute & Build Frontend
Jalankan perintah berikut di terminal:

```bash
php artisan wayfinder:generate
npm run build
```

---

## 3. Cara Mematikan Kembali (Disable Fortify Features)

Jika ingin **mematikan kembali registrasi publik / 2FA**:

1. **Comment kembali** fitur di `config/fortify.php`.
2. **Aktifkan kembali (uncomment)** stub routes di bawah `routes/web.php`.
3. Jalankan `php artisan wayfinder:generate` dan `npm run build`.
