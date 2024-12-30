export async function fetchAllUsersOfBranch(data) {
  let response;
  try {
    response = await fetch("http://localhost/backend/users");
  } catch (error) {
    return [];
  }

  let responseData = await response.json();
  if (!response.ok) return [];
  return responseData ? responseData : [];
}
