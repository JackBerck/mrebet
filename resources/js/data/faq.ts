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
                question: 'Di mana lokasi Desa Serayu Larangan dan bagaimana akses ke sana?',
                answer: 'Desa Serayu Larangan berada di Kecamatan Mrebet, Kabupaten Purbalingga (sekitar 13 km dari pusat kota Purbalingga). Akses jalan utama menuju desa sudah beraspal baik dan aman dilalui mobil maupun sepeda motor.'
            },
            {
                question: 'Apakah rute menuju titik wisata aman untuk kendaraan pribadi?',
                answer: 'Sangat aman. Akses menuju balai desa, spot persawahan, dan destinasi wisata di Serayu Larangan dapat diakses kendaraan roda dua maupun roda empat. Tersedia juga area parkir warga yang memadai.'
            }
        ]
    },
    {
        title: 'Tiket & Jam Operasional',
        items: [
            {
                question: 'Berapa harga tiket masuk dan biaya berkunjung di Serayu Larangan?',
                answer: 'Sebagian besar area pedesaan dan spot pemandangan gratis dikunjungi. Untuk beberapa destinasi wisata atau taman yang dikelola Pokdarwis, tiket berkisar antara Rp 5.000 hingga Rp 15.000 per orang.'
            },
            {
                question: 'Kapan waktu terbaik untuk berkunjung ke Desa Serayu Larangan?',
                answer: 'Waktu terbaik adalah pagi hari (pukul 06:00 - 10:00 WIB) untuk menikmati udara segar lereng Gunung Slamet dan pemandangan embun di persawahan, atau sore hari menjelang matahari terbenam.'
            }
        ]
    },
    {
        title: 'Fasilitas & Penginapan',
        items: [
            {
                question: 'Apakah tersedia homestay atau penginapan di Desa Serayu Larangan?',
                answer: 'Ya, tersedia beberapa homestay ramah lingkungan yang dikelola warga lokal serta opsi area perkemahian (camping ground) sederhana. Anda dapat merasakan kehangatan keramahan warga desa.'
            },
            {
                question: 'Apakah aman membawa anak-anak dan keluarga lansia?',
                answer: 'Sangat aman. Suasana pedesaan Serayu Larangan tenang dan damai, cocok untuk rekreasi keluarga segala usia.'
            }
        ]
    }
];
