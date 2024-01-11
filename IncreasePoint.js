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
            const apiUrl = 'https://dragongem.biasaigon.vn/sbar/api/login/';
            const credentials = {
                phone_number: '0' + account.phone_number,
                password: 'Tung123@'
            };

            try {
                const response = await axios.post(apiUrl, credentials);
                const token = response.data.data.token;
                await endSinglePlayGame("JWT " + token, account.id);
                const accountIndex = jsonDataAccount.findIndex(acc => acc.id === account.id);
                if (accountIndex !== -1) {
                    jsonDataAccount[accountIndex].token = token;
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function endSinglePlayGame(tokenJWT, accountId) {
            const apiUrl = 'https://dragongem.biasaigon.vn/sbar/api/end_single_play_game/';
            const apiPlayer = 'https://dragongem.biasaigon.vn/sbar/api/get_player_info/';
            try {
                const response = await axios.post(apiPlayer, {}, {
                    headers: {
                        Authorization: `${tokenJWT}`
                    }
                });
                let singlePlayLevel=response.data.data.single_play_level;
                for (let i = 0; i < 5; i++) {
                    if (singlePlayLevel < 5) {
                        singlePlayLevel++;
                    }
                    const gameData = {
                        is_win: true,
                        level: singlePlayLevel
                    };
                    try {
                        const response = await axios.post(apiUrl, gameData, {
                            headers: {
                                Authorization: `${tokenJWT}`
                            }
                        });
                        console.log(response.data);
                    } catch (error) {
                        console.error(`Gửi kết quả trò chơi thất bại cho tài khoản ${accountId}:`, error.response.data);
                    }
                }

            } catch (error) {
                console.error(`Thông tin người chơi thất bại cho tài khoản ${accountId}:`, error.response.data);
            }

        }

        for (const account of jsonDataAccount) {
            await login(account);
        }
        fs.writeFileSync(accountList, JSON.stringify(jsonDataAccount, null, 2), 'utf8');
    } catch (error) {
        console.error(error);
    }
});