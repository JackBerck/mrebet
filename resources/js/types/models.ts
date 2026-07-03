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
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    primary_media?: VillageMedia | null;
    media?: VillageMedia[];
};

export type VillageMedia = {
    id: number;
    mediable_id: number;
    mediable_type: string;
    file_path: string;
    alt_text: string | null;
    is_primary: boolean;
    created_at: string;
};

export type Destination = {
    id: number;
    village_id: number;
    name: string;
    slug: string;
    category: 'alam' | 'budaya' | 'buatan';
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
    status: 'draft' | 'published';
    created_at: string;
};

export type Event = {
    id: number;
    village_id: number;
    destination_id: number | null;
    title: string;
    slug: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    ticket_price: string;
    organizer: string | null;
    instagram: string | null;
    contact_person: string | null;
    qr_code_target: string | null;
    status: 'draft' | 'published';
    village?: Pick<Village, 'id' | 'name'>;
};

export type Blog = {
    id: number;
    user_id: number | null;
    village_id: number | null;
    title: string;
    slug: string;
    content: string;
    cover_image: string | null;
    status: 'draft' | 'published';
    views_count: number;
    published_at: string | null;
    created_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
