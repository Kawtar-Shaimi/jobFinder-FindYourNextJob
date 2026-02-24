export interface FavoriteOffer {
    id?: string;
    userId: string;
    offerId: string;
    title: string;
    company: string;
    location: string;
    url: string;
    salary?: string;
    publishedAt: string;
    apiSource: string;
}
