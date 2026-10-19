// -- TYPES

export type LocalizedText = string;

// ~~

export interface MenuButton
{
    route: string;
    text: LocalizedText;
}

// ~~

export interface HeaderMenuData
{
    menuButtonArray: MenuButton[];
}

// ~~

export interface FooterMenuData
{
    tagline: LocalizedText;
    menuButtonArray: MenuButton[];
    copyrightText: LocalizedText;
}

// ~~

export interface LanguageItem
{
    name: LocalizedText;
    iconPath: string;
}

// ~~

export interface ProductItem
{
    brandSlug: string;
    categorySlug: string;
    genderSlug: string;
    model: LocalizedText;
    price: number;
    imagePath: string;
    sizeSlugArray: string[];
}

// ~~

export interface TestimonialItem
{
    name: string;
    date: string;
    rating: number;
    imagePath: string;
    text: LocalizedText;
}

// ~~

export interface BlogPostItem
{
    id: string;
    image: string;
    title: LocalizedText;
    excerpt: LocalizedText;
    category: LocalizedText;
    date: string;
    author: string;
}

// ~~

export interface BlogCategoryItem
{
    slug: string;
    name: LocalizedText;
}

// ~~

export interface ApplicationData
{
    textBySlugMap: Record<string, LocalizedText>;
    languageByTagMap: Record<string, LanguageItem>;
    headerMenu: HeaderMenuData;
    footerMenu: FooterMenuData;
    genderBySlugMap: Record<string, LocalizedText>;
    categoryBySlugMap: Record<string, LocalizedText>;
    brandBySlugMap: Record<string, LocalizedText>;
    sizeBySlugMap: Record<string, LocalizedText>;
    productArray: ProductItem[];
    testimonialArray: TestimonialItem[];
    blogPostArray: BlogPostItem[];
    blogCategoryArray: BlogCategoryItem[];
    aboutPage: Record<string, LocalizedText | string>;
    contactPage: Record<string, LocalizedText | string>;
    homePage: Record<string, LocalizedText | string>;
    productsPage: Record<string, LocalizedText>;
    testimonialsPage: Record<string, LocalizedText>;
    blogPage: Record<string, LocalizedText>;
}

// ~~

export interface PageViewData
{
    languageTag: string;
    homePage: Record<string, LocalizedText | string>;
    headerMenu: HeaderMenuData;
    footerMenu: FooterMenuData;
    languageByTagMap: Record<string, LanguageItem>;
    pageUrlByLanguageTagMap: Record<string, string>;
    aboutPage?: Record<string, LocalizedText | string>;
    contactPage?: Record<string, LocalizedText | string>;
    productsPage?: Record<string, LocalizedText>;
    testimonialsPage?: Record<string, LocalizedText>;
    blogPage?: Record<string, LocalizedText>;
    genderBySlugMap?: Record<string, LocalizedText>;
    categoryBySlugMap?: Record<string, LocalizedText>;
    brandBySlugMap?: Record<string, LocalizedText>;
    sizeBySlugMap?: Record<string, LocalizedText>;
    productArray?: ProductItem[];
    testimonialArray?: TestimonialItem[];
    blogPostArray?: BlogPostItem[];
    blogCategoryArray?: BlogCategoryItem[];
}
