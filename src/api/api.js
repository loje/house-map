import api from './index';

const path = {
    houses: '/v2/houses',
};
const houses = (form) => api.post(path.houses, {...form});

export default {
    path,
    houses,
};