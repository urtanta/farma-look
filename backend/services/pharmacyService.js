// Pharmacy service for business logic
const supabase = require('../db/supabase');

const getGuardias = async () => {
    const { data, error } = await supabase
        .from('guardias')
        .select('*');
    
    if (error) throw error;
    return data;
};

const getGuardiasByProvince = async (province) => {
    const { data, error } = await supabase
        .from('guardias')
        .select('*')
        .eq('province', province);
    
    if (error) throw error;
    return data;
};

module.exports = {
    getGuardias,
    getGuardiasByProvince
};