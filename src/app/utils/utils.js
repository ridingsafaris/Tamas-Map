const backupRates = {
  "USD": {
    "USD": 1,
    "EUR": 1.1,
    "GBP": 1.3,
    "CAD": 0.75,
    "AUD": 0.65,
    "INR": 0.012,
    "DKK": 0.14,
    "RUB": 0.011,
    "ZAR": 0.055,
    "NZD": 0.60,
    "NOK": 0.095,
    "SEK": 0.093,
    "PLN": 0.25,
    "ISK": 0.0080961706
  },
  "GBP": {
    "USD": 0.736,
    "EUR": 0.86,
    "GBP": 1,
    "CAD": 0.53,
    "AUD": 0.48,
    "INR": 0.0084,
    "DKK": 0.115,
    "RUB": 0.0092,
    "ZAR": 0.042,
    "NZD": 0.44,
    "NOK": 0.072,
    "SEK": 0.077,
    "PLN": 0.2,
    "ISK": 0.0060305531
  },
  "EUR": {
    "USD": 0.85,
    "EUR": 1,
    "GBP": 1.16,
    "CAD": 0.62,
    "AUD": 0.55,
    "INR": 0.0097,
    "DKK": 0.13,
    "RUB": 0.01,
    "ZAR": 0.048,
    "NZD": 0.51,
    "NOK": 0.08,
    "SEK": 0.089,
    "PLN": 0.23,
    "ISK": 0.0069736071
  }
};

export const currencySymbols = {
  "EUR": "€",
  "GBP": "£",
  "USD": "$"
};

export const getConvertedPrice = (exchangeRates, selectedCurrency, value) => {
  try {
    const rate = exchangeRates?.[selectedCurrency]?.USD;
    if (typeof rate !== 'number' || rate <= 0) {
      return "-";
    }
    return parseInt(rate * value).toLocaleString("en-US");
  } catch (error) {
    console.warn('Currency conversion failed:', error);
    return "-";
  }
}

export const normalizePricesToUSD = (featureCollection, exchangeRates = backupRates) => {
  return {
    ...featureCollection,
    features: featureCollection.features.map(feature => {
      const { currency, price, price_per_night } = feature.properties;
  
      // Remove symbols and commas & parse to number
      const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
      const numericPriceNight = parseFloat(String(price_per_night).replace(/[^0-9.]/g, "")) || 0;
  
      // Find conversion rate (default to 1 if missing)

      const rate = exchangeRates.USD[currency] ?? 1;
  
      return {
        ...feature,
        properties: {
          ...feature.properties,
          price: parseInt(numericPrice * rate),
          price_per_night: parseInt(numericPriceNight * rate),
          currency: "USD"
        }
      };
    })
  };
}

export const normalizePricesFromUSD = (featureCollection, targetCurrency = "USD", exchangeRates = backupRates) => {
    return {
      ...featureCollection,
      features: featureCollection.features.map(feature => {
        const { currency, price, price_per_night } = feature.properties;
    
        // Remove symbols and commas & parse to number
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
        const numericPriceNight = parseFloat(String(price_per_night).replace(/[^0-9.]/g, "")) || 0;
    
        // Find conversion rate (default to 1 if missing)
        const rate = exchangeRates[targetCurrency][currency] ?? 1;
    
        return {
          ...feature,
          properties: {
            ...feature.properties,
            price: parseInt(numericPrice * rate),
            price_per_night: parseInt(numericPriceNight * rate),
            currency: targetCurrency
          }
        };
      })
    };
}

export const rebaseRates = (rates, newBase) => {
  const baseRate = parseFloat(rates[newBase]);
  const rebased = {};

  for (const [currency, rate] of Object.entries(rates)) {
    rebased[currency] = parseFloat(rate) / baseRate;
  }

  rebased[newBase] = 1; // ensure base is exactly 1
  return rebased;
}

export const invertRates = (ratesData) => {
  let invertedCurrencyData = {};

  for(let i in ratesData) {
    invertedCurrencyData[i] = Object.fromEntries(
      Object.entries(ratesData[i]).map(([currency, rate]) => [
        currency,
        1 / parseFloat(rate)
      ])
    ) 
  } 
  
  return invertedCurrencyData;
}

export const getNormalizedMinMaxTripPrice = (geojson) => {
    if (!geojson || !geojson.features) {
      throw new Error("Invalid GeoJSON FeatureCollection");
    }
    
    let normalizedData = normalizePricesToUSD(geojson);

    let prices = normalizedData.features
      .map(f => parseFloat(f.properties.price?.toString().replace(/[^0-9.]/g, "")))
      .filter(p => !isNaN(p));
    
    return [Math.min(...prices), Math.max(...prices)];
  }

export const getNormalizedMinMaxNightPrice = (geojson) => {
  if (!geojson || !geojson.features) {
    throw new Error("Invalid GeoJSON FeatureCollection");
  }

  let normalizedData = normalizePricesToUSD(geojson);
    
  let prices = normalizedData.features
    .map(f => parseFloat(f.properties.price_per_night?.toString().replace(/[^0-9.]/g, "")))
    .filter(p => !isNaN(p));
    
  return [Math.min(...prices), Math.max(...prices)];
}

export const isNewerByDays = (storedDateStr, inputDateStr, days = 1) => {
  const storedDate = new Date(storedDateStr);
  const inputDate = new Date(inputDateStr);

  // Calculate difference in milliseconds
  const diffMs = inputDate - storedDate;

  // Convert to full days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= days;
}
  