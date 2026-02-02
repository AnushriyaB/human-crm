/**
 * Centralized country, subdivision, and timezone data
 * 10 countries with full state/province/region lists + IANA timezone mappings
 */

// All countries with basic info
export const COUNTRIES = [
    { name: 'United States', code: 'US', hasSubdivisions: true },
    { name: 'Canada', code: 'CA', hasSubdivisions: true },
    { name: 'Australia', code: 'AU', hasSubdivisions: true },
    { name: 'India', code: 'IN', hasSubdivisions: true },
    { name: 'Brazil', code: 'BR', hasSubdivisions: true },
    { name: 'Mexico', code: 'MX', hasSubdivisions: true },
    { name: 'United Kingdom', code: 'GB', hasSubdivisions: true },
    { name: 'Germany', code: 'DE', hasSubdivisions: true },
    { name: 'France', code: 'FR', hasSubdivisions: true },
    { name: 'Japan', code: 'JP', hasSubdivisions: true },
    // Additional common countries (no subdivision dropdown, free text)
    { name: 'Singapore', code: 'SG', tz: 'SGT (UTC+8)' },
    { name: 'South Korea', code: 'KR', tz: 'KST (UTC+9)' },
    { name: 'New Zealand', code: 'NZ', tz: 'NZST (UTC+12)' },
    { name: 'Ireland', code: 'IE', tz: 'GMT (UTC+0)' },
    { name: 'Netherlands', code: 'NL', tz: 'CET (UTC+1)' },
    { name: 'Sweden', code: 'SE', tz: 'CET (UTC+1)' },
    { name: 'Switzerland', code: 'CH', tz: 'CET (UTC+1)' },
    { name: 'Spain', code: 'ES', tz: 'CET (UTC+1)' },
    { name: 'Italy', code: 'IT', tz: 'CET (UTC+1)' },
    { name: 'China', code: 'CN', tz: 'CST (UTC+8)' },
];

// United States - 50 states + DC
export const US_STATES = [
    { name: 'Alabama', code: 'AL', tz: 'CST (UTC-6)' },
    { name: 'Alaska', code: 'AK', tz: 'AKST (UTC-9)' },
    { name: 'Arizona', code: 'AZ', tz: 'MST (UTC-7)' },
    { name: 'Arkansas', code: 'AR', tz: 'CST (UTC-6)' },
    { name: 'California', code: 'CA', tz: 'PST (UTC-8)' },
    { name: 'Colorado', code: 'CO', tz: 'MST (UTC-7)' },
    { name: 'Connecticut', code: 'CT', tz: 'EST (UTC-5)' },
    { name: 'Delaware', code: 'DE', tz: 'EST (UTC-5)' },
    { name: 'District of Columbia', code: 'DC', tz: 'EST (UTC-5)' },
    { name: 'Florida', code: 'FL', tz: 'EST (UTC-5)' },
    { name: 'Georgia', code: 'GA', tz: 'EST (UTC-5)' },
    { name: 'Hawaii', code: 'HI', tz: 'HST (UTC-10)' },
    { name: 'Idaho', code: 'ID', tz: 'MST (UTC-7)' },
    { name: 'Illinois', code: 'IL', tz: 'CST (UTC-6)' },
    { name: 'Indiana', code: 'IN', tz: 'EST (UTC-5)' },
    { name: 'Iowa', code: 'IA', tz: 'CST (UTC-6)' },
    { name: 'Kansas', code: 'KS', tz: 'CST (UTC-6)' },
    { name: 'Kentucky', code: 'KY', tz: 'EST (UTC-5)' },
    { name: 'Louisiana', code: 'LA', tz: 'CST (UTC-6)' },
    { name: 'Maine', code: 'ME', tz: 'EST (UTC-5)' },
    { name: 'Maryland', code: 'MD', tz: 'EST (UTC-5)' },
    { name: 'Massachusetts', code: 'MA', tz: 'EST (UTC-5)' },
    { name: 'Michigan', code: 'MI', tz: 'EST (UTC-5)' },
    { name: 'Minnesota', code: 'MN', tz: 'CST (UTC-6)' },
    { name: 'Mississippi', code: 'MS', tz: 'CST (UTC-6)' },
    { name: 'Missouri', code: 'MO', tz: 'CST (UTC-6)' },
    { name: 'Montana', code: 'MT', tz: 'MST (UTC-7)' },
    { name: 'Nebraska', code: 'NE', tz: 'CST (UTC-6)' },
    { name: 'Nevada', code: 'NV', tz: 'PST (UTC-8)' },
    { name: 'New Hampshire', code: 'NH', tz: 'EST (UTC-5)' },
    { name: 'New Jersey', code: 'NJ', tz: 'EST (UTC-5)' },
    { name: 'New Mexico', code: 'NM', tz: 'MST (UTC-7)' },
    { name: 'New York', code: 'NY', tz: 'EST (UTC-5)' },
    { name: 'North Carolina', code: 'NC', tz: 'EST (UTC-5)' },
    { name: 'North Dakota', code: 'ND', tz: 'CST (UTC-6)' },
    { name: 'Ohio', code: 'OH', tz: 'EST (UTC-5)' },
    { name: 'Oklahoma', code: 'OK', tz: 'CST (UTC-6)' },
    { name: 'Oregon', code: 'OR', tz: 'PST (UTC-8)' },
    { name: 'Pennsylvania', code: 'PA', tz: 'EST (UTC-5)' },
    { name: 'Rhode Island', code: 'RI', tz: 'EST (UTC-5)' },
    { name: 'South Carolina', code: 'SC', tz: 'EST (UTC-5)' },
    { name: 'South Dakota', code: 'SD', tz: 'CST (UTC-6)' },
    { name: 'Tennessee', code: 'TN', tz: 'CST (UTC-6)' },
    { name: 'Texas', code: 'TX', tz: 'CST (UTC-6)' },
    { name: 'Utah', code: 'UT', tz: 'MST (UTC-7)' },
    { name: 'Vermont', code: 'VT', tz: 'EST (UTC-5)' },
    { name: 'Virginia', code: 'VA', tz: 'EST (UTC-5)' },
    { name: 'Washington', code: 'WA', tz: 'PST (UTC-8)' },
    { name: 'West Virginia', code: 'WV', tz: 'EST (UTC-5)' },
    { name: 'Wisconsin', code: 'WI', tz: 'CST (UTC-6)' },
    { name: 'Wyoming', code: 'WY', tz: 'MST (UTC-7)' },
];

// Canada - 13 provinces and territories
export const CA_PROVINCES = [
    { name: 'Alberta', code: 'AB', tz: 'MST (UTC-7)' },
    { name: 'British Columbia', code: 'BC', tz: 'PST (UTC-8)' },
    { name: 'Manitoba', code: 'MB', tz: 'CST (UTC-6)' },
    { name: 'New Brunswick', code: 'NB', tz: 'AST (UTC-4)' },
    { name: 'Newfoundland and Labrador', code: 'NL', tz: 'NST (UTC-3:30)' },
    { name: 'Northwest Territories', code: 'NT', tz: 'MST (UTC-7)' },
    { name: 'Nova Scotia', code: 'NS', tz: 'AST (UTC-4)' },
    { name: 'Nunavut', code: 'NU', tz: 'CST (UTC-6)' },
    { name: 'Ontario', code: 'ON', tz: 'EST (UTC-5)' },
    { name: 'Prince Edward Island', code: 'PE', tz: 'AST (UTC-4)' },
    { name: 'Quebec', code: 'QC', tz: 'EST (UTC-5)' },
    { name: 'Saskatchewan', code: 'SK', tz: 'CST (UTC-6)' },
    { name: 'Yukon', code: 'YT', tz: 'PST (UTC-8)' },
];

// Australia - 8 states and territories
export const AU_STATES = [
    { name: 'Australian Capital Territory', code: 'ACT', tz: 'AEST (UTC+10)' },
    { name: 'New South Wales', code: 'NSW', tz: 'AEST (UTC+10)' },
    { name: 'Northern Territory', code: 'NT', tz: 'ACST (UTC+9:30)' },
    { name: 'Queensland', code: 'QLD', tz: 'AEST (UTC+10)' },
    { name: 'South Australia', code: 'SA', tz: 'ACST (UTC+9:30)' },
    { name: 'Tasmania', code: 'TAS', tz: 'AEST (UTC+10)' },
    { name: 'Victoria', code: 'VIC', tz: 'AEST (UTC+10)' },
    { name: 'Western Australia', code: 'WA', tz: 'AWST (UTC+8)' },
];

// India - 28 states + 8 union territories (top 15 by population)
export const IN_STATES = [
    { name: 'Andhra Pradesh', code: 'AP', tz: 'IST (UTC+5:30)' },
    { name: 'Bihar', code: 'BR', tz: 'IST (UTC+5:30)' },
    { name: 'Delhi', code: 'DL', tz: 'IST (UTC+5:30)' },
    { name: 'Gujarat', code: 'GJ', tz: 'IST (UTC+5:30)' },
    { name: 'Haryana', code: 'HR', tz: 'IST (UTC+5:30)' },
    { name: 'Karnataka', code: 'KA', tz: 'IST (UTC+5:30)' },
    { name: 'Kerala', code: 'KL', tz: 'IST (UTC+5:30)' },
    { name: 'Madhya Pradesh', code: 'MP', tz: 'IST (UTC+5:30)' },
    { name: 'Maharashtra', code: 'MH', tz: 'IST (UTC+5:30)' },
    { name: 'Punjab', code: 'PB', tz: 'IST (UTC+5:30)' },
    { name: 'Rajasthan', code: 'RJ', tz: 'IST (UTC+5:30)' },
    { name: 'Tamil Nadu', code: 'TN', tz: 'IST (UTC+5:30)' },
    { name: 'Telangana', code: 'TG', tz: 'IST (UTC+5:30)' },
    { name: 'Uttar Pradesh', code: 'UP', tz: 'IST (UTC+5:30)' },
    { name: 'West Bengal', code: 'WB', tz: 'IST (UTC+5:30)' },
];

// Brazil - 27 states (top 15 by population)
export const BR_STATES = [
    { name: 'Bahia', code: 'BA', tz: 'BRT (UTC-3)' },
    { name: 'Ceará', code: 'CE', tz: 'BRT (UTC-3)' },
    { name: 'Distrito Federal', code: 'DF', tz: 'BRT (UTC-3)' },
    { name: 'Goiás', code: 'GO', tz: 'BRT (UTC-3)' },
    { name: 'Maranhão', code: 'MA', tz: 'BRT (UTC-3)' },
    { name: 'Mato Grosso', code: 'MT', tz: 'AMT (UTC-4)' },
    { name: 'Minas Gerais', code: 'MG', tz: 'BRT (UTC-3)' },
    { name: 'Pará', code: 'PA', tz: 'BRT (UTC-3)' },
    { name: 'Paraná', code: 'PR', tz: 'BRT (UTC-3)' },
    { name: 'Pernambuco', code: 'PE', tz: 'BRT (UTC-3)' },
    { name: 'Rio de Janeiro', code: 'RJ', tz: 'BRT (UTC-3)' },
    { name: 'Rio Grande do Sul', code: 'RS', tz: 'BRT (UTC-3)' },
    { name: 'Santa Catarina', code: 'SC', tz: 'BRT (UTC-3)' },
    { name: 'São Paulo', code: 'SP', tz: 'BRT (UTC-3)' },
];

// Mexico - 32 states (top 15 by population)
export const MX_STATES = [
    { name: 'Baja California', code: 'BC', tz: 'PST (UTC-8)' },
    { name: 'Chihuahua', code: 'CHIH', tz: 'MST (UTC-7)' },
    { name: 'Ciudad de México', code: 'CDMX', tz: 'CST (UTC-6)' },
    { name: 'Guanajuato', code: 'GTO', tz: 'CST (UTC-6)' },
    { name: 'Jalisco', code: 'JAL', tz: 'CST (UTC-6)' },
    { name: 'México', code: 'MEX', tz: 'CST (UTC-6)' },
    { name: 'Michoacán', code: 'MICH', tz: 'CST (UTC-6)' },
    { name: 'Nuevo León', code: 'NL', tz: 'CST (UTC-6)' },
    { name: 'Oaxaca', code: 'OAX', tz: 'CST (UTC-6)' },
    { name: 'Puebla', code: 'PUE', tz: 'CST (UTC-6)' },
    { name: 'Querétaro', code: 'QRO', tz: 'CST (UTC-6)' },
    { name: 'Quintana Roo', code: 'QROO', tz: 'EST (UTC-5)' },
    { name: 'Veracruz', code: 'VER', tz: 'CST (UTC-6)' },
    { name: 'Yucatán', code: 'YUC', tz: 'CST (UTC-6)' },
];

// United Kingdom - 4 nations
export const GB_NATIONS = [
    { name: 'England', code: 'ENG', tz: 'GMT (UTC+0)' },
    { name: 'Northern Ireland', code: 'NIR', tz: 'GMT (UTC+0)' },
    { name: 'Scotland', code: 'SCT', tz: 'GMT (UTC+0)' },
    { name: 'Wales', code: 'WLS', tz: 'GMT (UTC+0)' },
];

// Germany - 16 Bundesländer
export const DE_STATES = [
    { name: 'Baden-Württemberg', code: 'BW', tz: 'CET (UTC+1)' },
    { name: 'Bavaria', code: 'BY', tz: 'CET (UTC+1)' },
    { name: 'Berlin', code: 'BE', tz: 'CET (UTC+1)' },
    { name: 'Brandenburg', code: 'BB', tz: 'CET (UTC+1)' },
    { name: 'Bremen', code: 'HB', tz: 'CET (UTC+1)' },
    { name: 'Hamburg', code: 'HH', tz: 'CET (UTC+1)' },
    { name: 'Hesse', code: 'HE', tz: 'CET (UTC+1)' },
    { name: 'Lower Saxony', code: 'NI', tz: 'CET (UTC+1)' },
    { name: 'Mecklenburg-Vorpommern', code: 'MV', tz: 'CET (UTC+1)' },
    { name: 'North Rhine-Westphalia', code: 'NW', tz: 'CET (UTC+1)' },
    { name: 'Rhineland-Palatinate', code: 'RP', tz: 'CET (UTC+1)' },
    { name: 'Saarland', code: 'SL', tz: 'CET (UTC+1)' },
    { name: 'Saxony', code: 'SN', tz: 'CET (UTC+1)' },
    { name: 'Saxony-Anhalt', code: 'ST', tz: 'CET (UTC+1)' },
    { name: 'Schleswig-Holstein', code: 'SH', tz: 'CET (UTC+1)' },
    { name: 'Thuringia', code: 'TH', tz: 'CET (UTC+1)' },
];

// France - 18 regions (13 metropolitan + 5 overseas)
export const FR_REGIONS = [
    { name: 'Auvergne-Rhône-Alpes', code: 'ARA', tz: 'CET (UTC+1)' },
    { name: 'Bourgogne-Franche-Comté', code: 'BFC', tz: 'CET (UTC+1)' },
    { name: 'Brittany', code: 'BRE', tz: 'CET (UTC+1)' },
    { name: 'Centre-Val de Loire', code: 'CVL', tz: 'CET (UTC+1)' },
    { name: 'Corsica', code: 'COR', tz: 'CET (UTC+1)' },
    { name: 'Grand Est', code: 'GES', tz: 'CET (UTC+1)' },
    { name: 'Hauts-de-France', code: 'HDF', tz: 'CET (UTC+1)' },
    { name: 'Île-de-France', code: 'IDF', tz: 'CET (UTC+1)' },
    { name: 'Normandy', code: 'NOR', tz: 'CET (UTC+1)' },
    { name: 'Nouvelle-Aquitaine', code: 'NAQ', tz: 'CET (UTC+1)' },
    { name: 'Occitanie', code: 'OCC', tz: 'CET (UTC+1)' },
    { name: 'Pays de la Loire', code: 'PDL', tz: 'CET (UTC+1)' },
    { name: "Provence-Alpes-Côte d'Azur", code: 'PAC', tz: 'CET (UTC+1)' },
];

// Japan - 47 prefectures (grouped, showing major ones)
export const JP_PREFECTURES = [
    { name: 'Aichi', code: '23', tz: 'JST (UTC+9)' },
    { name: 'Chiba', code: '12', tz: 'JST (UTC+9)' },
    { name: 'Fukuoka', code: '40', tz: 'JST (UTC+9)' },
    { name: 'Hiroshima', code: '34', tz: 'JST (UTC+9)' },
    { name: 'Hokkaido', code: '01', tz: 'JST (UTC+9)' },
    { name: 'Hyogo', code: '28', tz: 'JST (UTC+9)' },
    { name: 'Kanagawa', code: '14', tz: 'JST (UTC+9)' },
    { name: 'Kyoto', code: '26', tz: 'JST (UTC+9)' },
    { name: 'Nagano', code: '20', tz: 'JST (UTC+9)' },
    { name: 'Niigata', code: '15', tz: 'JST (UTC+9)' },
    { name: 'Okinawa', code: '47', tz: 'JST (UTC+9)' },
    { name: 'Osaka', code: '27', tz: 'JST (UTC+9)' },
    { name: 'Saitama', code: '11', tz: 'JST (UTC+9)' },
    { name: 'Shizuoka', code: '22', tz: 'JST (UTC+9)' },
    { name: 'Tokyo', code: '13', tz: 'JST (UTC+9)' },
];

// Subdivision map by country code
export const SUBDIVISIONS = {
    US: US_STATES,
    CA: CA_PROVINCES,
    AU: AU_STATES,
    IN: IN_STATES,
    BR: BR_STATES,
    MX: MX_STATES,
    GB: GB_NATIONS,
    DE: DE_STATES,
    FR: FR_REGIONS,
    JP: JP_PREFECTURES,
};

// Subdivision label by country
export const SUBDIVISION_LABELS = {
    US: 'state',
    CA: 'province',
    AU: 'state/territory',
    IN: 'state',
    BR: 'state',
    MX: 'state',
    GB: 'nation/region',
    DE: 'state',
    FR: 'region',
    JP: 'prefecture',
    default: 'state/region',
};

/**
 * Get subdivisions for a country by name or code
 * @param {string} countryNameOrCode - Country name or ISO code
 * @returns {Array|null} - Array of subdivisions or null if not available
 */
export function getSubdivisions(countryNameOrCode) {
    // Try by code first
    if (SUBDIVISIONS[countryNameOrCode]) {
        return SUBDIVISIONS[countryNameOrCode];
    }

    // Try to find country by name
    const country = COUNTRIES.find(c =>
        c.name === countryNameOrCode || c.code === countryNameOrCode
    );

    if (country && SUBDIVISIONS[country.code]) {
        return SUBDIVISIONS[country.code];
    }

    return null;
}

/**
 * Get the subdivision label for a country
 * @param {string} countryNameOrCode - Country name or ISO code
 * @returns {string} - Label like "state", "province", "region"
 */
export function getSubdivisionLabel(countryNameOrCode) {
    const country = COUNTRIES.find(c =>
        c.name === countryNameOrCode || c.code === countryNameOrCode
    );

    if (country) {
        return SUBDIVISION_LABELS[country.code] || SUBDIVISION_LABELS.default;
    }

    return SUBDIVISION_LABELS.default;
}

/**
 * Get timezone for a subdivision
 * @param {string} countryCode - Country ISO code
 * @param {string} subdivisionName - Name of the subdivision
 * @returns {string|null} - Timezone string or null
 */
export function getTimezoneForSubdivision(countryCode, subdivisionName) {
    const subdivisions = SUBDIVISIONS[countryCode];
    if (!subdivisions) return null;

    const subdivision = subdivisions.find(s =>
        s.name === subdivisionName || s.code === subdivisionName
    );

    return subdivision?.tz || null;
}

/**
 * Get default timezone for a country (for countries without subdivision data)
 * @param {string} countryNameOrCode - Country name or ISO code  
 * @returns {string|null} - Timezone string or null
 */
export function getCountryTimezone(countryNameOrCode) {
    const country = COUNTRIES.find(c =>
        c.name === countryNameOrCode || c.code === countryNameOrCode
    );

    return country?.tz || null;
}
