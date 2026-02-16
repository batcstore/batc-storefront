# Shopify Integration Setup

## Configuration Steps

1. **Get Shopify Credentials:**
   - Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
   - Navigate to: Apps → Develop apps → Create an app
   - Name it "Bantu Ants Website"
   - Configure Storefront API scopes:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_checkouts`
     - `unauthenticated_write_checkouts`
   - Install the app and copy the **Storefront API access token**

2. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```

3. **Add Your Credentials to `.env`:**
   ```
   VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token_here
   ```

4. **Update Products with Shopify IDs:**
   - In `constants.ts`, add `shopifyVariantId` to each product
   - Find variant IDs in Shopify Admin → Products → [Product] → Variants

## How It Works

1. **Product Display**: Currently using local products from `constants.ts`
2. **Checkout Flow**: 
   - User adds items to cart
   - Clicks checkout
   - System creates Shopify checkout session
   - User redirected to Shopify hosted checkout
   - After payment, customer returns to your site

## Optional: Fetch Products from Shopify

To fetch products directly from Shopify instead of using local constants:

```typescript
import { fetchProducts } from './services/shopifyService';

// In your component
const [products, setProducts] = useState([]);

useEffect(() => {
  fetchProducts().then(setProducts);
}, []);
```

## Testing

1. Use Shopify's test mode for development
2. Test card: `1` (Visa), expiry: any future date, CVV: any 3 digits
3. Monitor checkout in Shopify Admin → Orders
