const {exec} = require('child_process');
const axios = require('axios');

// Function to perform login and get token
async function loginAndGetToken() {
    const apiUrlLogin = 'https://dragongem.biasaigon.vn/sbar/api/login/';

    const credentials = {
        phone_number: '0334463900',
        password: 'Tung123@'
    };

    try {
        const response = await axios.post(apiUrlLogin, credentials);
        const token = response.data.data.token;
        return token;
    } catch (error) {
        console.error('Login failed:', error.response.data);
        throw error;
    }
}

async function getRewards() {
    const apiUrlRewards = 'https://dragongem.biasaigon.vn/sbar/api/get_rewards/';

    try {
        const token = await loginAndGetToken();

        const response = await axios.post(apiUrlRewards, {}, {
            headers: {
                Authorization: `JWT ${token}`
            }
        });
        const rewardsData = response.data.data;
        for (const reward of rewardsData) {
            if (reward.slug === 'topup' || reward.slug === 'grab' || reward.slug === 'shopee') {
                if (parseInt(reward.description.match(/\d+/)[0]) !== 0) {
                    exec('node C:/Users/Admin/PhpstormProjects/BiaSaigon/Gifts.js', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error executing the second script: ${error}`);
                            return;
                        }
                        console.log(`Output: ${stdout}`);
                    });
                }
            }
        }
    } catch (error) {
        console.error('Get Rewards failed:', error);
    }
}

setInterval(() => {
    getRewards();
}, 30 * 60 * 1000);
