"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  normalizePricesToUSD,
  getNormalizedMinMaxNightPrice,
  getNormalizedMinMaxTripPrice,
  isNewerByDays,
  rebaseRates,
  invertRates
} from '../utils/utils';
import { createClient } from '@sanity/client';

const client = createClient({
  "projectId": process.env.NEXT_PUBLIC_SANITY_PROJECTID,
  "dataset": process.env.NEXT_PUBLIC_SANITY_DATASET,
  "apiVersion": "2024-06-01",
  "useCdn": false,
  "token": process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const RIDES_QUERY = `
*[
  _type == "ride" &&
  defined(latitude) && defined(longitude)
]{
  _id,
  "title": coalesce(title, name),
  "operator": coalesce(operator, operatorName, operator->name),
  address,
  description,
  category,
  riding_level,
  image_url,
  months,
  url,
  black_saddle,
  black_saddle_url,
  price,
  currency,
  duration,
  latitude,
  longitude
} | order(title asc)
`;

const loadRidesFromSanity = async () => {
  const rows = await client.fetch(RIDES_QUERY);
  return rows;
}

const getRatesDataFromAPI = async () => {
  // Fetch exchange rates
  const ratesRaw = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=d51a3f2df7de4467b05b5c874c2489b9&symbols=GBP,USD,EUR,AUD,NZD,CAD,ZAR,DKK,SEK,NOK,ISK,INR,RUB,PLN');
  const rates = await ratesRaw.json();
      
  // Convert all rates to numbers
  for(let i in rates.rates) {
    rates.rates[i] = rates.rates[i] * 1;
  }

  // Assemble the rates obj
  // This is what we'd store in Sanity
  let ratesObj = {
    "USD": rates.rates,
    "EUR": rebaseRates(rates.rates, "EUR"),
    "GBP": rebaseRates(rates.rates, "GBP") 
  }

  return ratesObj;
}

const getRatesFromSanity = async () => {
  const data = await client.fetch(`*[_type == "rates"]{created_at, rates_json}`);
  if(data.length > 0) {
    // This tells if the difference in dates is smaller than one day or not
    // If it is smaller then there is no need to do an update of the exchange rates
    const ratesRequiresUpdate = isNewerByDays(data[0].created_at, new Date().toISOString());

    if(ratesRequiresUpdate) {

      console.log("Requires update...");

      let ratesData = await getRatesDataFromAPI();

      // Invert the currency data received from the API so that so that the value of each currency attribute in the parent would show
      // how much base currency equals the value
      // "GBP": {"USD": 0.736} which means that 1 USD equals 0.736 GBP
      // we have this because all prices are defaulted in USD

      let invertedRatesData = invertRates(ratesData);


      // TODO - Store ratesData in Sanity for future use
      await saveRatesToSanity(invertedRatesData);

      // Return ratesData to caller
      return invertedRatesData;

    }
    else
    {
      console.log("Doesn't require update...");
      return data[0].rates_json;
    }
  }
  else
  {
    console.log("Running for the first time, requires update...")
    let ratesData = await getRatesDataFromAPI();

      // Invert the currency data received from the API so that so that the value of each currency attribute in the parent would show
      // how much base currency equals the value
      // "GBP": {"USD": 0.736} which means that 1 USD equals 0.736 GBP
      // we have this because all prices are defaulted in USD

    let invertedRatesData = invertRates(ratesData);
    return invertedRatesData;
  }
}

const saveRatesToSanity = async (rates) => {
  const doc = {
    _type: "exchangeRate",
    created_at: new Date().toISOString(),
    rates_json: JSON.stringify(rates)
  };

  const result = await client.create(doc);
  console.log("Saved:", result);
}

const MapDataContext = createContext();

const ridingLevelsData = [
  "Beginner",
  "Intermediate",
  "Advanced"
];

const categoriesShort = [
  'Black Saddle',
  'Trail Rides',
  'Hotel Stay',
  'Luxury',
  'Wildlife Safari',
  'Fast Riding',
  'Western Riding',
  'Short Break',
  'Day Rides',
  'Dressage',
  'Family Holiday',
  'Camping'
];

const months = {
  "Jan": "January",
  "Feb": "February",
  "Mar": "March",
  "Apr": "April",
  "May": "May",
  "Jun": "June",
  "Jul": "July",
  "Aug": "August",
  "Sept": "September",
  "Oct": "October",
  "Nov": "November",
  "Dec": "December"
}

const currencyList = {
  "EUR": "EUR",
  "GBP": "GBP",
  "USD": "USD"
};

const priceTypesData = {
  "NIGHT": "Per Night",
  "TRIP": "Per Trip"
}

export const MapDataProvider = ({ children }) => {
  
  // States
  const [map, setMap] = useState(null);
  const [mapWasClicked, setMapWasClicked] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isFilterToggleVisible, setIsFilterToggleVisible] = useState(true);
  const [isFilterBoxVisible, setIsFilterBoxVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [ridesGeojson, setRidesGeojson] = useState(null);

  const [rideCategoriesShort, setRideCategoriesShort] = useState(categoriesShort);
  const [rideCategoriesLong, setRideCategoriesLong] = useState([]);
  const [rideMonths, setRideMonths] = useState(months);
  const [currencies, setCurrencies] = useState(currencyList);
  const [priceTypes, setPriceTypes] = useState(priceTypesData);
  const [ridingLevels, setRidingLevels] = useState(ridingLevelsData);
  const [tripPriceInterval, setTripPriceInterval] = useState([]);
  const [nightPriceInterval, setNightPriceInterval] = useState([]);
  const [availableRides, setAvailableRides] = useState(0);
  const [clickedRide, setClickedRide] = useState(null);

  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedGeocode, setSelectedGeocode] = useState(null);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  
  const [exchangeRates, setExchangeRates] = useState(null);

  // Methods

  const convertRidesToGeojson = (rides) => {

    let geojson = {
      type: "FeatureCollection",
      features: []
    };
    // Loop through rides, convert each of them into a geojson feature and then add to the FeatureCollection
    rides.forEach(ride => {
     let feature = {
      "type": "Feature",
      "id": ride._id,
      "properties": {
        "isBlackSaddle": ride.black_saddle,
        "duration": ride.duration,
        "price_per_night": ride.duration === null || isNaN(ride.duration) ? ride.price : parseInt(ride.price / ride.duration),
        "currency": ride.currency,
        "riding_level": ride.riding_level,
        "months": ride.months,
        "category": ride.black_saddle ? [...ride.category, "Black Saddle"] : ride.category,
        "price": ride.price,
        "name": ride.operator,
        "title": ride.title,
        "address": ride.address,
        "description": ride.description,
        "image_url": ride.image_url,
        "url": ride.url,
        "black_saddle_url": ride.black_saddle_url
       },
       "geometry": {
          "type": "Point",
          "coordinates": [
            ride.longitude,
            ride.latitude
          ]
        }
      }
  
      geojson.features.push(feature);
  
    })
  
    return geojson;
  }

  //  Determine the categories from the rides and save them to context
  const extractDistinctCategories = (rides) => {
    console.log(rides);
    let categories = [];
    rides.forEach((ride) => {
      ride.category.forEach((category) => {
        if(!categories.includes(category)) {
          categories.push(category);
        }
      })
    });
    categories.sort();
    
    return categories;
  }  

  useEffect(() => {

    const fetchRides = async () => {
      let ridesData = await loadRidesFromSanity();
      const ratesData = await getRatesFromSanity();

      ridesData = ridesData.filter((ride) => {
        return ride.black_saddle !== null && ride.black_saddle !== undefined && ride.category !== null && ride.category !== undefined;
      });

      // Extract all distinct categories from the rides
      const categories = extractDistinctCategories(ridesData);
      
      // Convert the incoming ride data to a geojson Feature Collection
      const geojson = convertRidesToGeojson(ridesData);

      // Normalize prices to USD, the result is a copy of the geojson but with all prices in USD
      const normalized = normalizePricesToUSD(geojson, ratesData);

      // Save modified data to state variables
      setExchangeRates(ratesData);
      setRideCategoriesLong(categories);
      setTripPriceInterval(prev => getNormalizedMinMaxTripPrice(normalized));
      setNightPriceInterval(prev => getNormalizedMinMaxNightPrice(normalized));    
      setRidesGeojson(normalized);      
    }

    fetchRides();

  }, []);  

  return (
    <MapDataContext.Provider value={{ 
      map, setMap, 
      mapWasClicked, setMapWasClicked,
      mapReady, setMapReady, 
      isLoading, setIsLoading, 
      isPopupVisible, setIsPopupVisible, 
      popupData, setPopupData,
      isFilterBoxVisible, setIsFilterBoxVisible,
      suggestionsVisible, setSuggestionsVisible,
      isFilterToggleVisible, setIsFilterToggleVisible,
      rideCategoriesShort, setRideCategoriesShort,
      rideCategoriesLong, setRideCategoriesLong,
      rideMonths, setRideMonths,
      priceTypes, setPriceTypes,
      currencies, setCurrencies,
      ridingLevels,
      ridesGeojson,
      tripPriceInterval, setTripPriceInterval,
      nightPriceInterval, setNightPriceInterval,
      availableRides, setAvailableRides,
      clickedRide, setClickedRide,
      selectedRide, setSelectedRide,
      selectedGeocode, setSelectedGeocode,
      isSuggestionSelected, setIsSuggestionSelected,
      exchangeRates, setExchangeRates
     }}
    >
      {children}
    </MapDataContext.Provider>
  );
};

export const useMapData = () => useContext(MapDataContext);