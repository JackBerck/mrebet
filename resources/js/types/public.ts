export type Destination = {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    ticket_price: number;
    village: { id: number; name: string } | null;
    qr_code_target: string | null;
    latitude: number;
    longitude: number;
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
    cover_image: string | null;
    views_count: number;
    published_at: string;
    author: { id: number; full_name: string } | null;
};

export type Stats = {
    villages: number;
    destinations: number;
    events: number;
};
