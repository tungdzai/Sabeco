const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const accountList = 'account.json';
console.time('TotalRuntime');
fs.readFile(accountList, 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    try {
        const jsonDataAccount = JSON.parse(data);
        async function login(account) {
            const apiUrlLogin = 'https://dragongem.biasaigon.vn/sbar/api/login/';
            const credentials = {
                phone_number: '0' + account.phone_number,
                password: 'Tung123@'
            };

            try {
                const response = await axios.post(apiUrlLogin, credentials);
                const token = response.data.data.token;
                const accountIndex = jsonDataAccount.findIndex(acc => acc.id === account.id);
                if (accountIndex !== -1) {
                    jsonDataAccount[accountIndex].token = token;
                    await redeemReward(token, account.phone_number);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function redeemReward(token, phone_number) {
            const apiUrlRedeem = 'https://dragongem.biasaigon.vn/sbar/api/redeem_reward/';
            const rewardIds = [3, 2];

            for (const rewardId of rewardIds) {
                const redeemData = {
                    reward_id: rewardId
                };

                try {
                    const response = await axios.post(apiUrlRedeem, redeemData, {
                        headers: {
                            Authorization: `JWT ${token}`
                        }
                    });
                    console.log(phone_number, response.data);
                } catch (error) {
                    console.error(`Tài khoản ${phone_number} - Đổi quà thất bại cho reward_id: ${rewardId}:`, error.response.data);
                }
            }
        }

        for (const account of jsonDataAccount) {
            await login(account);
        }
        console.timeEnd('TotalRuntime');
        exec('node C:/Users/Admin/PhpstormProjects/BiaSaigon/SaveGift.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing the second script: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);
        });
    } catch (error) {
        console.error(error);
    }
});
