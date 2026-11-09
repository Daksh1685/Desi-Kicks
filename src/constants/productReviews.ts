import type { ProductReview } from '../types/product';

export const SAMPLE_PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'royal-velvet-embroidered-mojari': [
    {
      id: 'rev-101',
      author: 'Aditya Mathur',
      city: 'Jaipur, Rajasthan',
      rating: 5,
      date: 'Oct 28, 2026',
      title: 'Zero heel bite at my brother’s wedding!',
      comment:
        'Normally, mojaris cause terrible blisters on the back of my ankles. I wore these for over 7 hours continuously during the baraat and reception. The padded memory foam footbed and soft velvet heel collar are pure genius. Got tons of compliments on the gold Zari embroidery.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 9',
      helpfulCount: 42,
    },
    {
      id: 'rev-102',
      author: 'Rohan Deshmukh',
      city: 'Pune, Maharashtra',
      rating: 5,
      date: 'Nov 02, 2026',
      title: 'Royal look paired with raw silk kurta',
      comment:
        'The deep maroon velvet and craftsmanship feel like footwear from a boutique couture salon. Well worth every rupee. Leather sole is sturdy and has great grip thanks to the rubber heel insert.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 8',
      helpfulCount: 19,
    },
    {
      id: 'rev-103',
      author: 'Sameer Varma',
      city: 'New Delhi',
      rating: 4,
      date: 'Oct 15, 2026',
      title: 'Great craftsmanship, order 1 size up if broad feet',
      comment:
        'The shoe is handcrafted beautifully. Since I have wider feet, I initially tried UK 9 but exchanged for UK 10 which fit like a glove. Customer support handled the doorstep size swap within 48 hours.',
      fitFeedback: 'Runs Small',
      verifiedBuyer: true,
      sizePurchased: 'UK 10',
      helpfulCount: 14,
    },
  ],
  'cloudknit-daily-slip-on-loafer': [
    {
      id: 'rev-201',
      author: 'Ananya Roy',
      city: 'Bengaluru, Karnataka',
      rating: 5,
      date: 'Nov 01, 2026',
      title: 'Hands-down the best office commute shoes',
      comment:
        'I walk 1.5 km to and from the metro station daily. These feel lighter than running sneakers and look sharp with both formal trousers and ankle jeans. The bamboo insole keeps feet completely odor-free in hot weather.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 7',
      helpfulCount: 31,
    },
    {
      id: 'rev-202',
      author: 'Karthik S.',
      city: 'Chennai, Tamil Nadu',
      rating: 5,
      date: 'Oct 20, 2026',
      title: 'Like walking on memory foam mattresses',
      comment:
        'Slip-in design without bending down or using hands is super convenient. High durability sole that hasn’t shown any wear after 2 months of everyday wear.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 9',
      helpfulCount: 16,
    },
  ],
  'aura-metallic-block-heel-sandal': [
    {
      id: 'rev-301',
      author: 'Pooja Kashyap',
      city: 'Mumbai, Maharashtra',
      rating: 5,
      date: 'Oct 24, 2026',
      title: 'Danced all night at Sangeet without carrying flat backups',
      comment:
        'Block heel distribution is flawless. The metallic sheen matches champagne gold and silver lehengas equally well. No toe pinching or ball-of-foot burning!',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 6',
      helpfulCount: 27,
    },
    {
      id: 'rev-302',
      author: 'Simran Chadha',
      city: 'Chandigarh',
      rating: 5,
      date: 'Nov 04, 2026',
      title: 'Stunning festive finish & cloud cushioning',
      comment:
        'The cushioned gel sole in a 2.5-inch heel is something I have never experienced from luxury brands. Five stars all the way!',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 5',
      helpfulCount: 11,
    },
  ],
  'vortex-flex-gym-pro-runner': [
    {
      id: 'rev-401',
      author: 'Arjun Nambiar',
      city: 'Kochi, Kerala',
      rating: 5,
      date: 'Oct 30, 2026',
      title: 'Fantastic shock absorption for 10K road runs',
      comment:
        'Midsole gives bouncy propulsion on hard tarmac. Ankle support counter is very sturdy. At ₹3,295, this easily beats shoes costing ₹8,000+ from legacy athletic brands.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 10',
      helpfulCount: 22,
    },
  ],
  'handcrafted-heritage-penny-loafer': [
    {
      id: 'rev-501',
      author: 'Devendra Singhania',
      city: 'Kolkata, West Bengal',
      rating: 5,
      date: 'Oct 19, 2026',
      title: 'Agra leather patina is exquisite',
      comment:
        'The hand-burnished tan leather looks richer with every week of conditioning. Comfortable leather insole and firm heel. Perfect boardroom companion.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 8',
      helpfulCount: 18,
    },
  ],
  'airslide-ortho-comfort-chappal': [
    {
      id: 'rev-601',
      author: 'Meenakshi Sundaram',
      city: 'Hyderabad, Telangana',
      rating: 5,
      date: 'Nov 05, 2026',
      title: 'Relieved my morning heel pain',
      comment:
        'Doctor suggested contoured footwear for heel spurs. This arch cradle is firm yet gentle. Waterproof so I can wear it inside the house and out in the garden.',
      fitFeedback: 'True to Size',
      verifiedBuyer: true,
      sizePurchased: 'UK 7',
      helpfulCount: 35,
    },
  ],
};

export const SIZING_CHART_DATA = [
  { uk: 'UK 4', us: 'US 5', eu: 'EU 37', footCm: '23.0 cm', footInches: '9.0 in' },
  { uk: 'UK 5', us: 'US 6', eu: 'EU 38', footCm: '23.8 cm', footInches: '9.4 in' },
  { uk: 'UK 6', us: 'US 7', eu: 'EU 39', footCm: '24.5 cm', footInches: '9.6 in' },
  { uk: 'UK 7', us: 'US 8', eu: 'EU 40.5', footCm: '25.4 cm', footInches: '10.0 in' },
  { uk: 'UK 8', us: 'US 9', eu: 'EU 42', footCm: '26.2 cm', footInches: '10.3 in' },
  { uk: 'UK 9', us: 'US 10', eu: 'EU 43', footCm: '27.1 cm', footInches: '10.7 in' },
  { uk: 'UK 10', us: 'US 11', eu: 'EU 44.5', footCm: '28.0 cm', footInches: '11.0 in' },
  { uk: 'UK 11', us: 'US 12', eu: 'EU 46', footCm: '28.8 cm', footInches: '11.3 in' },
];
