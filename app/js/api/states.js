export async function fetchStates() {
    try {
        const response = await fetch('http://localhost/backend/utils/states');
        
        if (!response.ok) {
            throw new Error('Error al obtener los estados');
        }

        const statesResponse = await response.json();

        return statesResponse;
    } catch (error) {
        return [];
    }
}