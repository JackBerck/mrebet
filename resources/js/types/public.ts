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
    description: string;
    start_date: string;
    end_date: string;
    start_time: string | null;
    ticket_price: number;
    organizer: string;
    village: { id: number; name: string } | null;
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
