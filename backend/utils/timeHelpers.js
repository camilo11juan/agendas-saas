const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};

const checkOverlap = (slotStart, slotEnd, appointmentStart, appointmentEnd) => {
    return slotStart < appointmentEnd && slotEnd > appointmentStart;
};

module.exports = { addMinutes, checkOverlap };