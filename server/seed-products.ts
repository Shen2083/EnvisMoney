// Seed script to create Envis subscription products in Stripe
// Run with: npx tsx server/seed-products.ts

import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Envis subscription products...');

  // Check if products already exist
  const existingProducts = await stripe.products.search({ 
    query: "name:'Envis Family'" 
  });
  
  if (existingProducts.data.length > 0) {
    console.log('Products already exist. Skipping creation.');
    console.log('Existing products:', existingProducts.data.map(p => p.name));
    return;
  }

  // Create Family Plan product
  const familyProduct = await stripe.products.create({
    name: 'Envis Family',
    description: 'Essential financial coaching for couples and families. Includes intelligent account categorisation, fairness tracking, and progress monitoring.',
    metadata: {
      tier: 'family',
      features: 'mine-yours-ours,fairness-engine,progress-tracking',
    }
  });

  // Create Family Plan price (£9.99/month)
  const familyPrice = await stripe.prices.create({
    product: familyProduct.id,
    unit_amount: 999, // £9.99 in pence
    currency: 'gbp',
    recurring: { interval: 'month' },
    metadata: {
      display_name: 'Family Plan',
    }
  });

  console.log(`Created Family Plan: ${familyProduct.id} with price ${familyPrice.id}`);

  // Create Family Plus product
  const familyPlusProduct = await stripe.products.create({
    name: 'Envis Family Plus',
    description: 'Complete financial coaching experience with all five proprietary modules. Includes values mediation and proactive coaching for deeper relationship alignment.',
    metadata: {
      tier: 'family_plus',
      features: 'mine-yours-ours,fairness-engine,progress-tracking,values-mediation,proactive-coaching',
    }
  });

  // Create Family Plus price (£19.99/month)
  const familyPlusPrice = await stripe.prices.create({
    product: familyPlusProduct.id,
    unit_amount: 1999, // £19.99 in pence
    currency: 'gbp',
    recurring: { interval: 'month' },
    metadata: {
      display_name: 'Family Plus',
    }
  });

  console.log(`Created Family Plus: ${familyPlusProduct.id} with price ${familyPlusPrice.id}`);
  console.log('Done! Products created successfully.');
}

createProducts().catch(console.error);
