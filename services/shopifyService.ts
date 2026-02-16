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

// Fetch all products from Shopify via proxy server (local or Vercel)
export const fetchProducts = async (): Promise<ShopifyProduct[]> => {
  try {
    const isDev = !import.meta.env.PROD;
    const apiUrl = isDev 
      ? 'http://localhost:3001/api/shopify/products' 
      : '/api/shopify/products';
    
    console.log('Fetching products from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Proxy server error: ${response.status}`);
    }

    const products = await response.json();
    console.log('Fetched products from proxy:', products);

    return products.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        description: product.description || '',
        images: product.images.edges.map((imgEdge: any) => ({
          src: imgEdge.node.src,
          altText: imgEdge.node.altText,
        })),
        variants: product.variants.edges.map((varEdge: any) => {
          const variant = varEdge.node;
          return {
            id: variant.id,
            title: variant.title,
            price: {
              amount: variant.price || '0',
              currencyCode: 'USD',
            },
            available: true,
            image: variant.image ? {
              src: variant.image.src,
              altText: variant.image.altText,
            } : undefined,
          };
        }),
        handle: product.handle,
      };
    });
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
};

// Create checkout and get checkout URL
export const createCheckout = async (lineItems: Array<{ variantId: string; quantity: number }>) => {
  // For now, return a simple checkout URL - you can integrate Shopify Buy Button later if needed
  try {
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
    if (!domain) {
      console.error('Shopify domain not configured');
      return null;
    }
    // Build a cart URL with variant numeric IDs: /cart/<variantId>:<qty>,<variantId2>:<qty2>
    const parts: string[] = [];
    for (const li of lineItems) {
      if (!li.variantId) continue;
      // variantId may be a GraphQL gid (gid://shopify/ProductVariant/1234567890)
      const idStr = String(li.variantId);
      const numeric = idStr.includes('/') ? idStr.split('/').pop() : idStr;
      if (!numeric) continue;
      parts.push(`${numeric}:${li.quantity}`);
    }
    const path = parts.length > 0 ? `/cart/${parts.join(',')}` : '/cart';
    return `https://${domain}${path}`;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};


