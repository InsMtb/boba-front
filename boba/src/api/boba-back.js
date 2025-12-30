const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

/**
 * Récupère tous les Bubble Teas.
 */
export const getAllBubbleTeas = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/bubble-teas`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des bubble teas:", error);
        throw error;
    }
};

/**
 * Récupère un Bubble Tea par son ID.
 */
export const getBubbleTea = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/bubble-teas/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la récupération du bubble tea ${id}:`, error);
        throw error;
    }
};

/**
 * Crée un nouveau Bubble Tea.
 * @param {Object} bubbleTea - { name, note, address }
 */
export const createBubbleTea = async (bubbleTea) => {
    try {
        const response = await fetch(`${BACKEND_URL}/bubble-teas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bubbleTea),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error("Erreur lors de la création du bubble tea:", error);
        throw error;
    }
};

/**
 * Met à jour un Bubble Tea existant.
 * @param {number|string} id 
 * @param {Object} bubbleTea - { name, note, address }
 */
export const updateBubbleTea = async (id, bubbleTea) => {
    try {
        const response = await fetch(`${BACKEND_URL}/bubble-teas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bubbleTea),
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du bubble tea ${id}:`, error);
        throw error;
    }
};

/**
 * Supprime un Bubble Tea.
 */
export const deleteBubbleTea = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/bubble-teas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        if (response.status === 204) {
            return true;
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la suppression du bubble tea ${id}:`, error);
        throw error;
    }
};

/**
 * Initialise la base de données.
 */
export const initDatabase = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/init-db`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données:", error);
        throw error;
    }
};
