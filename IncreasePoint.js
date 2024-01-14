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
            } catch (error) {
                console.error(error);
            }
        }

        async function endSinglePlayGame(tokenJWT, accountId) {
            const apiGame = 'https://dragongem.biasaigon.vn/sbar/api/end_single_play_game/';
            const apiPlayer = 'https://dragongem.biasaigon.vn/sbar/api/get_player_info/';
            try {
                const response = await axios.post(apiPlayer, {}, {
                    headers: {
                        Authorization: `${tokenJWT}`
                    }
                });
                let single_play_level=response.data.data.single_play_level;
                let turn_of_single_play=response.data.data.turn_of_single_play;
                if (turn_of_single_play !== 0){
                    for (let i = 0; i < 5; i++) {
                        if (single_play_level < 5) {
                            single_play_level++;
                        }
                        const gameData = {
                            is_win: true,
                            level: single_play_level
                        };
                        try {
                            const response = await axios.post(apiGame, gameData, {
                                headers: {
                                    Authorization: `${tokenJWT}`
                                }
                            });
                            console.log(response.data)
                        } catch (error) {
                            console.error(`Kết quả trò chơi thất bại  ${accountId}:`, error.response.data);
                        }
                    }
                }
                const accountIndex = jsonDataAccount.findIndex(acc => acc.id === accountId);
                if (accountIndex !== -1) {
                    jsonDataAccount[accountIndex].single_play_level = response.data.data.single_play_level;
                    jsonDataAccount[accountIndex].turn_of_scan = response.data.data.turn_of_scan;
                    jsonDataAccount[accountIndex].turn_of_single_play = response.data.data.turn_of_single_play;
                    jsonDataAccount[accountIndex].turn_of_team_play = response.data.data.turn_of_team_play;
                    jsonDataAccount[accountIndex].gems = response.data.data.gems;
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