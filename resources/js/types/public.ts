export type Destination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    category_label?: string;
    description: string | null;
    ticket_price: string;
    ticket_info: string | null;
    open_time: string | null;
    close_time: string | null;
    operational_days: string | null;
    facilities: string[] | null;
    latitude: number | null;
    longitude: number | null;
    qr_code_target: string | null;
    village: { id: number; name: string; slug?: string } | null;
    primary_media: { file_path: string } | null;
    media?: { id: number; file_path: string; is_primary: boolean }[];
};

export type Event = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    ticket_price: number;
    organizer: string | null;
    contact_person: string | null;
    instagram: string | null;
    qr_code_target: string | null;
    village: { id: number; name: string; slug?: string } | null;
    destination?: { id: number; name: string; slug: string } | null;
    primary_media: { file_path: string } | null;
    media?: { id: number; file_path: string; is_primary: boolean }[];
};

export type Blog = {
    id: number;
    title: string;
    slug: string;
    content?: string;
    cover_image: string | null;
    views_count: number;
    published_at: string;
    author: { id: number; name: string } | null;
    village: { id: number; name: string; slug?: string } | null;
    reading_time?: number;
};

export type Village = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    head_name: string | null;
    contact_phone: string | null;
    latitude: number | null;
    longitude: number | null;
    qr_code_target: string | null;
    destinations_count?: number;
    events_count?: number;
    primary_media: { file_path: string } | null;
    media?: { id: number; file_path: string; is_primary: boolean }[];
    destinations?: Destination[];
    events?: Event[];
    blogs?: Blog[];
};

export type Stats = {
    villages: number;
    destinations: number;
    events: number;
};
