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
    var thoiGianHienTai = new Date();
    var nam = thoiGianHienTai.getFullYear();
    var thang = thoiGianHienTai.getMonth() + 1;
    var ngay = thoiGianHienTai.getDate();
    var gio = thoiGianHienTai.getHours();
    var phut = thoiGianHienTai.getMinutes();
    var giay = thoiGianHienTai.getSeconds();
    console.log("Thời gian quét: " + gio + ":" + phut + ":" + giay + " " + ngay + "/" + thang + "/" + nam)
    const apiUrlRewards = 'https://dragongem.biasaigon.vn/sbar/api/get_rewards/';

    try {
        const token = await loginAndGetToken();

        const response = await axios.post(apiUrlRewards, {}, {
            headers: {
                Authorization: `JWT ${token}`
            }
        });
        const rewardsData = response.data.data;
        let checkReward = false;
        for (const reward of rewardsData) {
            if (reward.slug === 'grab' && parseInt(reward.description.match(/\d+/)[0]) !== 0) {
                checkReward = true;
            } else if (reward.slug === 'shopee' && parseInt(reward.description.match(/\d+/)[0]) !== 0) {
                checkReward = true;
            }
        }
        if (checkReward) {
            exec('node D:/BiaSaigon/GrabShopee.js', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing the second script: ${error}`);
                    return;
                }
                console.log(stdout);
            });
        }
    } catch (error) {
        console.error('Get Rewards failed:', error);
    }
}

setInterval(() => {
    getRewards();
}, 5 * 60 * 1000);
