import Client from 'shopify-buy';

// Your Shopify credentials
const client = Client.buildClient({
  domain: 'xs0kk2-cz.myshopify.com',
  storefrontAccessToken: 'aaadc07ce3a5db8aff73540c3e268fd2',
});

async function testShopify() {
  console.log('🔍 Fetching products from Shopify...\n');
  
  try {
    const products = await client.product.fetchAll();
    
    if (products.length === 0) {
      console.log('❌ No products found in your Shopify store.');
      console.log('👉 Go to https://xs0kk2-cz.myshopify.com/admin/products to add products\n');
      return;
    }
    
    console.log(`✅ Found ${products.length} product(s):\n`);
    
    products.forEach((product, index) => {
      console.log(`\n📦 Product ${index + 1}:`);
      console.log(`   Title: ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Description: ${product.description?.substring(0, 100)}...`);
      console.log(`   Images: ${product.images.length} image(s)`);
      console.log(`   Variants: ${product.variants.length}`);
      
      product.variants.forEach((variant, vIndex) => {
        console.log(`      Variant ${vIndex + 1}:`);
        console.log(`         ID: ${variant.id}`);
        console.log(`         Title: ${variant.title}`);
        console.log(`         Price: ${variant.price.amount} ${variant.price.currencyCode}`);
        console.log(`         Available: ${variant.available}`);
      });
    });
    
    console.log('\n\n💡 Copy the Variant IDs above and add them to your products in constants.ts as shopifyVariantId\n');
    
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    console.log('\n📝 Make sure your Storefront API has the correct permissions:');
    console.log('   - unauthenticated_read_product_listings');
    console.log('   - unauthenticated_read_checkouts');
    console.log('   - unauthenticated_write_checkouts\n');
  }
}

testShopify();
