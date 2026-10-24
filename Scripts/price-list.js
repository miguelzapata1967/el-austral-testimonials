/* ==========================================================================
   EL AUSTRAL CONSULTANT — PRICE LIST (generated 2026-10-18 10:50)
   Do not edit by hand. Make changes in Admin > Price Maintenance, which
   keeps English/Data/price_list.csv and price_history.csv, then download
   this file again and replace it in English/Scripts/.
   ========================================================================== */

window.PRICE_LIST = {
  "retail": {
    "pricing": "per-database-plan",
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "includes": "Clean file, bad-data file and written report.",
        "price": 220,
        "term": "one-time"
      },
      {
        "id": "full",
        "name": "Report + Full Analysis",
        "includes": "Basic, plus the full set of calculations.",
        "price": 350,
        "term": "one-time"
      },
      {
        "id": "mom",
        "name": "Month to Month",
        "includes": "Basic, plus monthly trend comparison.",
        "price": 450,
        "term": "one-time"
      },
      {
        "id": "yoy",
        "name": "Year to Year",
        "includes": "Basic, plus yearly trend comparison.",
        "price": 450,
        "term": "one-time"
      },
      {
        "id": "quarterly",
        "name": "Quarterly",
        "includes": "Basic, plus a comparison for the quarter you choose.",
        "price": 450,
        "term": "one-time"
      },
      {
        "id": "monthly",
        "name": "Monthly Services",
        "includes": "All of the above, plus 4 weekly reports. For single-location businesses.",
        "price": 1200,
        "term": "per month per database"
      }
    ]
  },
  "analytics": {
    "pricing": "quote"
  },
  "bi": {
    "pricing": "quote"
  },
  "engineering": {
    "pricing": "per-database",
    "name": "Monthly Services + Pipelines",
    "includes": "Everything in Monthly Services, plus automated pipelines that connect all your locations to one live dashboard at your main office.",
    "price": 1800,
    "term": "per month per database",
    "note": "Standard updates are hourly. Near real-time updates cost extra and are quoted separately.",
    "minDatabases": 2
  },
  "forecasting": {
    "pricing": "per-database-volume",
    "name": "Forecast",
    "price": 450,
    "volumeFrom": 6,
    "volumeDiscount": 0.2,
    "term": "each, one-time",
    "note": "Ordering 6 or more databases takes 20% off the regular $450 price, so every database in the order costs $360."
  },
  "abtesting": {
    "pricing": "per-database",
    "name": "One-month A/B test",
    "includes": "Full monthly service for each location in the test (weekly reports), plus a separate A/B testing report after the fourth week covering the full 30 days.",
    "price": 1200,
    "term": "per location for the test month",
    "maxDatabases": 3,
    "minDatabases": 1
  },
  "workforce": {
    "pricing": "employee-tiers",
    "name": "Workforce analysis",
    "tiers": [
      {
        "upTo": 100,
        "price": 1500
      },
      {
        "upTo": 200,
        "price": 2500
      }
    ],
    "extraPer100": 1000,
    "term": "per analysis",
    "note": "Headcount is counted on the date your data is submitted."
  },
  "security": {
    "pricing": "quote"
  }
};

// Kept for older pages that still read the Retail list in the original format.
window.RETAIL_PRICES = (window.PRICE_LIST.retail ? window.PRICE_LIST.retail.plans : []).map(p => ({ name: p.name, includes: p.includes, price: p.price, term: p.term }));
