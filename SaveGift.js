const fs = require('fs');
const axios = require('axios');
const accountList = 'account.json';
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
                    await getAndSaveVoucher(token, account.phone_number, account.id);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function getAndSaveVoucher(token, phone_number, accountId) {
            const apiUrlGetVoucher = 'https://dragongem.biasaigon.vn/sbar/api/get_player_rewards/';
            const requestData = {
                page: 1,
                limit: 100
            };

            try {
                const response = await axios.post(apiUrlGetVoucher, requestData, {
                    headers: {
                        Authorization: `JWT ${token}`
                    }
                });
                const rewards = response.data.data.records;
                for (const reward of rewards) {
                    const slug = reward.reward.slug;
                    const voucherCode = reward.voucher;
                    console.log(voucherCode)
                    const accountIndex = jsonDataAccount.findIndex(acc => acc.id === accountId);
                    if (accountIndex !== -1) {
                        if (slug === 'grab') {
                            jsonDataAccount[accountIndex].grab = voucherCode;
                            console.log(`${phone_number} - Lưu voucher grab thành công: ${voucherCode}`);
                        }
                    }
                }
                fs.writeFileSync(accountList, JSON.stringify(jsonDataAccount, null, 2), 'utf8');
            } catch (error) {
                console.error(`${phone_number} - Lấy voucher thất bại:`, error.response.data);
            }
        }
        for (const account of jsonDataAccount) {
            await login(account);
        }
    } catch (error) {
        console.error(error);
    }
});