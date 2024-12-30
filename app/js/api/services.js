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
