import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

async function seedBillingProducts() {
  console.log('Creating Envis billing products...');

  // Check for existing products with billing metadata
  const existingProducts = await stripe.products.list({ limit: 100 });
  const monthlyProduct = existingProducts.data.find(p => p.metadata?.billing === 'monthly' && p.active);
  const annualProduct = existingProducts.data.find(p => p.metadata?.billing === 'annual' && p.active);

  let monthlyPriceId: string;
  let annualPriceId: string;

  if (monthlyProduct) {
    console.log('Monthly product already exists:', monthlyProduct.id);
    // Check if price is already £19.99 (1999 pence)
    const prices = await stripe.prices.list({ product: monthlyProduct.id, active: true });
    const correctPrice = prices.data.find(p => p.unit_amount === 1999);
    if (correctPrice) {
      monthlyPriceId = correctPrice.id;
    } else {
      // Create new price at £19.99 and archive old ones
      const newPrice = await stripe.prices.create({
        product: monthlyProduct.id,
        unit_amount: 1999,
        currency: 'gbp',
        recurring: { interval: 'month' },
      });
      monthlyPriceId = newPrice.id;
      // Archive old prices
      for (const oldPrice of prices.data) {
        if (oldPrice.id !== newPrice.id) {
          await stripe.prices.update(oldPrice.id, { active: false });
        }
      }
      console.log('Updated Monthly price to £19.99:', newPrice.id);
    }
  } else {
    const product = await stripe.products.create({
      name: 'Envis Monthly Plan',
      description: 'Complete family financial coaching with all features. Billed monthly.',
      metadata: { billing: 'monthly' },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1999,
      currency: 'gbp',
      recurring: { interval: 'month' },
    });
    monthlyPriceId = price.id;
    console.log('Created Monthly Plan:', product.id, 'with price', price.id);
  }

  if (annualProduct) {
    console.log('Annual product already exists:', annualProduct.id);
    const prices = await stripe.prices.list({ product: annualProduct.id, active: true });
    annualPriceId = prices.data[0]?.id || '';
  } else {
    const product = await stripe.products.create({
      name: 'Envis Annual Plan',
      description: 'Complete family financial coaching with all features. Billed annually - save 44%.',
      metadata: { billing: 'annual' },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 13499,
      currency: 'gbp',
      recurring: { interval: 'year' },
    });
    annualPriceId = price.id;
    console.log('Created Annual Plan:', product.id, 'with price', price.id);
  }

  console.log('\nBilling Products Ready:');
  console.log('  Monthly Price ID:', monthlyPriceId);
  console.log('  Annual Price ID:', annualPriceId);
  console.log('\nDone!');
}

seedBillingProducts().catch(console.error);
