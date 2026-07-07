export type Guideline = {
    title: string;
    description: string;
    type: 'do' | 'dont';
    icon: string;
};

export const guidelines: Guideline[] = [
    {
        title: "Bawa Tumbler & Kantong Sampah",
        description: "Bantu kami menjaga alam Mrebet dengan tidak meninggalkan sampah plastik di area curug maupun hutan.",
        type: 'do',
        icon: 'Droplet'
    },
    {
        title: "Gunakan Sepatu yang Tepat",
        description: "Medan menuju curug seringkali licin dan berlumut. Sepatu gunung atau sandal trekking sangat disarankan.",
        type: 'do',
        icon: 'MapPin'
    },
    {
        title: "Sapa Warga Lokal",
        description: "Masyarakat Mrebet sangat ramah. Jangan ragu untuk tersenyum dan menyapa saat melintasi permukiman.",
        type: 'do',
        icon: 'Heart'
    },
    {
        title: "Jangan Merusak Tanaman",
        description: "Hutan pinus dan perkebunan warga adalah sumber kehidupan. Jangan memetik atau merusak tanaman sembarangan.",
        type: 'dont',
        icon: 'Leaf'
    },
    {
        title: "Jangan Berenang di Area Terlarang",
        description: "Beberapa curug memiliki pusaran air yang kuat di bawahnya. Patuhi rambu peringatan kedalaman air.",
        type: 'dont',
        icon: 'AlertCircle'
    },
    {
        title: "Jangan Nyalakan Api Sembarangan",
        description: "Di musim kemarau, daun pinus sangat mudah terbakar. Gunakan area camping yang sudah disediakan jika ingin membuat api unggun.",
        type: 'dont',
        icon: 'Flame'
    }
];
