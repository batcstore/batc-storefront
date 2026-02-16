import Client from 'shopify-buy';

// Initialize Shopify client
const client = Client.buildClient({
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || '',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: Array<{
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
    image?: {
      src: string;
      altText?: string;
    };
  }>;
  handle: string;
}

// Fetch all products from Shopify
export const fetchProducts = async (): Promise<ShopifyProduct[]> => {
  try {
    const products = await client.product.fetchAll();
    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      images: product.images.map((img: any) => ({
        src: img.src,
        altText: img.altText,
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
        },
        available: variant.available,
        image: variant.image ? {
          src: variant.image.src,
          altText: variant.image.altText,
        } : undefined,
      })),
      handle: product.handle,
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProduct = async (productId: string): Promise<ShopifyProduct | null> => {
  try {
    const product = await client.product.fetch(productId);
    if (!product) return null;
    
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      images: product.images.map((img: any) => ({
        src: img.src,
        altText: img.altText,
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
        },
        available: variant.available,
        image: variant.image ? {
          src: variant.image.src,
          altText: variant.image.altText,
        } : undefined,
      })),
      handle: product.handle,
    };
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
};

// Create checkout and get checkout URL
export const createCheckout = async (lineItems: Array<{ variantId: string; quantity: number }>) => {
  try {
    const checkout = await client.checkout.create();
    const checkoutWithItems = await client.checkout.addLineItems(checkout.id, lineItems);
    return checkoutWithItems.webUrl; // URL to redirect to Shopify checkout
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    return null;
  }
};

export default client;
