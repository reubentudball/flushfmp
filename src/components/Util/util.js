import ngeohash from "ngeohash";


export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371000; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };
  
  export const generateGeohash = (latitude, longitude, precision = 9) => {
    console.log("Generating geohash for", latitude, longitude);
    const geoHash = ngeohash.encode(latitude, longitude, precision);
    console.log("Generated geohash", geoHash);
    return geoHash;
  };


  export const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Invalid Date";
  
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


 export const capitalizeStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);