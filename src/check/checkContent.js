const axios = require('axios')

const check = async (id) => {
    const response = await axios.get(`https://www.elcinema.com/en/work/${id}/`)
    return (response.data.includes(`/booking/${id}`))
}

module.exports = check