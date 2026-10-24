// =====================================================================
// EL AUSTRAL CONSULTANT — TYPE OF BUSINESS LIST
// Used by the customer profile ("Type of business" dropdown).
// Each group says which cost matters most and what we measure "per unit",
// so the system knows which calculations and which uploads to ask for.
// The math (revenue − costs = profit) is the same for every group.
// =====================================================================

const BUSINESS_TYPES = [
  {
    group: 'Food & Beverage',
    mainCost: 'Food cost',
    perUnit: 'Per cover (guest), per seat per hour',
    types: [
      'Full-service restaurant',
      'Quick-service / fast food',
      'Fast casual',
      'Pizzeria',
      'Café / coffee shop',
      'Bakery',
      'Ice cream / dessert shop',
      'Juice / smoothie bar',
      'Food truck',
      'Catering',
      'Ghost kitchen / delivery-only'
    ]
  },
  {
    group: 'Bars & Nightlife',
    mainCost: 'Beverage cost (pour cost %)',
    perUnit: 'Per drink, per guest, keg yield',
    types: [
      'Bar / pub',
      'Sports bar',
      'Nightclub / lounge',
      'Wine bar',
      'Brewery / taproom',
      'Winery / tasting room',
      'Distillery'
    ]
  },
  {
    group: 'Lodging & Hospitality',
    mainCost: 'Labor and room operating cost',
    perUnit: 'Per available room (RevPAR), occupancy rate, average daily rate',
    types: [
      'Hotel',
      'Motel',
      'Bed & breakfast / inn',
      'Vacation rental',
      'Campground / RV park',
      'Event venue / banquet hall'
    ]
  },
  {
    group: 'Retail',
    mainCost: 'Merchandise cost',
    perUnit: 'Per square foot, inventory turnover',
    types: [
      'Supermarket / grocery',
      'Convenience store',
      'Gas station',
      'Liquor store',
      'Pharmacy',
      'Clothing / apparel',
      'Shoes',
      'Jewelry',
      'Electronics',
      'Furniture / home goods',
      'Hardware / home improvement',
      'Sporting goods',
      'Bookstore',
      'Gift / specialty shop',
      'Florist',
      'Pet store',
      'Toys / hobby',
      'Beauty / cosmetics',
      'Auto parts',
      'Thrift / secondhand',
      'General store / other retail'
    ]
  },
  {
    group: 'E-commerce',
    mainCost: 'Merchandise and shipping cost',
    perUnit: 'Average order value, per customer',
    types: [
      'Online store',
      'Marketplace seller (Amazon, Etsy, eBay)',
      'Subscription box',
      'Digital products'
    ]
  },
  {
    group: 'Personal Services',
    mainCost: 'Labor cost',
    perUnit: 'Per client, per appointment',
    types: [
      'Hair salon',
      'Barbershop',
      'Nail salon',
      'Spa / massage',
      'Tattoo / piercing',
      'Laundromat / dry cleaner',
      'Pet grooming / boarding',
      'Photography studio'
    ]
  },
  {
    group: 'Health & Fitness',
    mainCost: 'Labor cost',
    perUnit: 'Per member, per patient; churn rate',
    types: [
      'Gym / fitness center',
      'Yoga / Pilates studio',
      'Martial arts studio',
      'Medical clinic',
      'Dental office',
      'Chiropractic',
      'Physical therapy',
      'Optometry',
      'Veterinary clinic'
    ]
  },
  {
    group: 'Professional Services',
    mainCost: 'Labor cost (billable hours)',
    perUnit: 'Per client, per billable hour',
    types: [
      'Accounting / bookkeeping',
      'Law office',
      'Consulting',
      'Marketing / advertising agency',
      'Real estate agency',
      'Insurance agency',
      'IT services',
      'Staffing agency'
    ]
  },
  {
    group: 'Home & Trade Services',
    mainCost: 'Labor and materials',
    perUnit: 'Per job, per technician hour',
    types: [
      'General contractor / construction',
      'Plumbing',
      'Electrical',
      'HVAC',
      'Roofing',
      'Landscaping',
      'Cleaning service',
      'Handyman',
      'Pest control',
      'Painting'
    ]
  },
  {
    group: 'Automotive',
    mainCost: 'Parts and labor',
    perUnit: 'Per vehicle, per service bay hour',
    types: [
      'Auto repair shop',
      'Auto body / collision',
      'Car wash',
      'Car dealership',
      'Tire shop',
      'Towing'
    ]
  },
  {
    group: 'Education & Childcare',
    mainCost: 'Labor cost',
    perUnit: 'Per student, per enrollment',
    types: [
      'Daycare / preschool',
      'Tutoring center',
      'Private school',
      'Music / dance school',
      'Driving school',
      'Training center'
    ]
  },
  {
    group: 'Entertainment & Recreation',
    mainCost: 'Labor and facility cost',
    perUnit: 'Per visitor, per ticket',
    types: [
      'Movie theater',
      'Bowling alley',
      'Arcade / family entertainment center',
      'Golf course / driving range',
      'Escape room',
      'Amusement / water park'
    ]
  },
  {
    group: 'Manufacturing & Wholesale',
    mainCost: 'Raw materials and production labor',
    perUnit: 'Per unit produced, per order',
    types: [
      'Manufacturer',
      'Food production / packaging',
      'Wholesale / distribution',
      'Warehouse / storage',
      'Print shop'
    ]
  },
  {
    group: 'Transportation & Logistics',
    mainCost: 'Fuel, vehicle and labor cost',
    perUnit: 'Per mile, per delivery',
    types: [
      'Trucking',
      'Delivery / courier',
      'Moving company',
      'Limousine / rideshare fleet'
    ]
  },
  {
    group: 'Agriculture',
    mainCost: 'Seed, feed, supplies and labor',
    perUnit: 'Per acre, per harvest',
    types: [
      'Farm / ranch',
      'Plant nursery / greenhouse'
    ]
  },
  {
    group: 'Other',
    mainCost: 'Depends on the business',
    perUnit: 'Per customer',
    types: [
      'Nonprofit',
      'Freelancer / sole proprietor',
      'Other (please describe)'
    ]
  }
];

// Fills a <select> with grouped options, e.g. fillBusinessTypes('business-type')
function fillBusinessTypes(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  BUSINESS_TYPES.forEach(g => {
    const og = document.createElement('optgroup');
    og.label = g.group;
    g.types.forEach(t => og.appendChild(new Option(t, t)));
    select.appendChild(og);
  });
}

// Names used by the old 7-item list. Customer profiles saved before this
// list existed keep their value; this maps them to the new types.
const LEGACY_BUSINESS_TYPES = {
  'Restaurant':  'Full-service restaurant',
  'Store':       'General store / other retail',
  'Hotel':       'Hotel',
  'Bar/Pub':     'Bar / pub',
  'Warehouse':   'Warehouse / storage',
  'Gas Station': 'Gas station',
  'Other':       'Other (please describe)'
};

// Returns the group details for a chosen business type (old names included).
// "Other: <description>" values belong to the Other group.
function businessGroupOf(type) {
  if (!type) return null;
  let t = LEGACY_BUSINESS_TYPES[type] || type;
  if (/^Other:/i.test(t)) t = 'Other (please describe)';
  return BUSINESS_TYPES.find(g => g.types.includes(t)) || null;
}

window.BUSINESS_TYPES = BUSINESS_TYPES;
window.fillBusinessTypes = fillBusinessTypes;
window.businessGroupOf = businessGroupOf;
