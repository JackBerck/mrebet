export type FaqItem = {
    question: string;
    answer: string;
};

export type FaqCategory = {
    title: string;
    items: FaqItem[];
};

export const faqs: FaqCategory[] = [
    {
        title: 'Akses & Transportasi',
        items: [
            {
                question: 'Apakah rute menuju Mrebet aman untuk kendaraan kecil?',
                answer: 'Ya, rute utama menuju sebagian besar destinasi di Mrebet sudah beraspal dan aman untuk kendaraan kecil maupun sepeda motor. Namun, untuk beberapa curug tersembunyi, Anda mungkin perlu berjalan kaki dari area parkir desa.'
            },
            {
                question: 'Apakah tersedia angkutan umum ke lokasi wisata?',
                answer: 'Angkutan umum (angdes) tersedia dari terminal Purbalingga hingga pertigaan Mrebet. Setelah itu, disarankan menggunakan ojek pangkalan, ojek online, atau menyewa kendaraan karena akses langsung ke titik wisata cukup terbatas untuk angkutan besar.'
            }
        ]
    },
    {
        title: 'Tiket & Jam Operasional',
        items: [
            {
                question: 'Berapa harga tiket rata-rata destinasi wisata di Mrebet?',
                answer: 'Harga tiket masuk sangat terjangkau, berkisar antara Rp 5.000 hingga Rp 15.000 per orang, belum termasuk biaya parkir kendaraan.'
            },
            {
                question: 'Apakah wisata buka setiap hari?',
                answer: 'Sebagian besar destinasi alam buka setiap hari mulai pukul 07:00 hingga 17:00 WIB. Disarankan untuk datang di pagi hari agar terhindar dari hujan sore.'
            }
        ]
    },
    {
        title: 'Fasilitas & Keamanan',
        items: [
            {
                question: 'Apakah aman membawa anak-anak dan lansia?',
                answer: 'Untuk destinasi desa wisata dan taman, sangat aman untuk anak-anak dan lansia. Namun, untuk destinasi curug (air terjun) dan pendakian, diperlukan kehati-hatian ekstra karena medan yang licin dan menanjak.'
            },
            {
                question: 'Apakah ada penginapan di sekitar area Mrebet?',
                answer: 'Ada beberapa homestay yang dikelola warga lokal dan area camping ground. Anda bisa merasakan pengalaman menginap dengan suasana asri desa di lereng Gunung Slamet.'
            }
        ]
    }
];
