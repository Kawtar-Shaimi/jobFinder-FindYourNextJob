export interface FavoriteOffer {
    id?: number;
    userId: number;
    offerId: string;
    title: string;
    company: string;
    location: string;
    url: string;
    salary?: string;
    publishedAt: string;
    apiSource: string;
}
