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
