const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const fetchBusinessInfo = async (slug) => {
    try {
        const res = await fetch(`${API_URL}/business/${slug}`);
        if (res.status === 404) return null;
        return await res.json();
    } catch (e) {
        console.error("Error conectando al backend", e);
        return null;
    }
};

export const fetchServices = async (businessId) => {
    const res = await fetch(`${API_URL}/services?businessId=${businessId}`);
    return await res.json();
};

export const fetchAvailableSlots = async (businessId, date, serviceId) => {
    const res = await fetch(`${API_URL}/slots?businessId=${businessId}&date=${date}&serviceId=${serviceId}`);
    return await res.json();
};

export const createAppointment = async (data) => {
    const res = await fetch(`${API_URL}/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const loginUser = async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    // Si falla (401), lanzamos error para capturarlo en el form
    if (!res.ok) throw new Error('Login fallido');
    return await res.json();
};

export const fetchAdminAppointments = async (businessId) => {
    const res = await fetch(`${API_URL}/admin/appointments?businessId=${businessId}`);
    return await res.json();
};

export const createService = async (serviceData) => {
    const res = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
    });
    return await res.json();
};

export const deleteService = async (serviceId) => {
    await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'DELETE',
    });
};


export const fetchSchedule = async (businessId) => {
    const res = await fetch(`${API_URL}/schedule?businessId=${businessId}`);
    return await res.json();
};

export const updateSchedule = async (data) => {
    const res = await fetch(`${API_URL}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const createBusiness = async (data) => {
    const res = await fetch(`${API_URL}/superadmin/business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};