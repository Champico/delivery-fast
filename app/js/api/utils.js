export async function fetchStates() {
  let response;
  try {
    response = await fetch("http://localhost/backend/utils/states");
  } catch (error) {
    return [];
  }

  let responseData = await response.json();
  if (!response.ok) return [];
  return responseData ? responseData : [];
}


export async function fetchServices() {
  let response;
  try {
    response = await fetch("http://localhost/backend/utils/services");
  } catch (error) {
    return [];
  }

  let responseData = await response.json();
  if (!response.ok) return [];
  return responseData ? responseData : [];
}


export async function fetchStatus() {
  let response;
  try {
    response = await fetch("http://localhost/backend/utils/status");
  } catch (error) {
    return [];
  }

  let responseData = await response.json();
  if (!response.ok) return [];
  return responseData ? responseData : [];
}


export async function validateZipCode(zipCode) {
  let response;
  try {
    const url = `http://localhost/backend/utils/location-data/${zipCode}`;
    response = await fetch(url);
  } catch (error) {
    return false;
  }

  let responseData = await response.json();
  if (!response.ok) return false;
  return responseData ? responseData : false;
}

