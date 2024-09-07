const { Client, Intents, REST, Routes } = require('discord.js');
const fs = require('fs');

// Discord 클라이언트 설정
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// 유저 DB와 고유번호 카운터
let userDB = {};
let idCounter = 1;

// JSON 파일 로드
if (fs.existsSync('userDB.json')) {
    userDB = JSON.parse(fs.readFileSync('userDB.json', 'utf8'));
    idCounter = Object.keys(userDB).length + 1;
}

// Discord 슬래시 명령어 등록
const commands = [
    {
        name: '인증',
        description: '로블록스 사용자 이름으로 고유번호를 발급합니다.',
        options: [
            {
                name: 'roblox_username',
                type: 3, // 문자열 타입
                description: '로블록스 사용자 이름',
                required: true
            }
        ]
    }
];

// 봇이 시작될 때 명령어 등록
client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken('MTI3NjE1MjYwMjgxNTUwMDMyOQ.GkTxp9.olXzBqcueCh0DHlOknI_PhnWtdad22YR7pZFVA');
    try {
        console.log('슬래시 명령어 등록 중...');
        await rest.put(
            Routes.applicationCommands('1276152602815500329'),
            { body: commands }
        );
        console.log('슬래시 명령어 등록 성공');
    } catch (error) {
        console.error('명령어 등록 실패:', error);
    }
});

// 슬래시 명령어 처리
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === '인증') {
        const robloxUsername = options.getString('roblox_username');

        // 이미 인증된 사용자인지 확인
        if (userDB[interaction.user.id]) {
            await interaction.reply(`이미 인증되었습니다. 고유번호: ${userDB[interaction.user.id].id}`);
            return;
        }

        // 고유번호 발급
        userDB[interaction.user.id] = { id: idCounter++, robloxUsername };
        fs.writeFileSync('userDB.json', JSON.stringify(userDB, null, 2));

        // 닉네임 변경
        const nickname = `${userDB[interaction.user.id].id} • ${robloxUsername} • 시민`;
        await interaction.member.setNickname(nickname)
            .then(() => interaction.reply(`인증 성공! 고유번호는 ${userDB[interaction.user.id].id}입니다.`))
            .catch(() => interaction.reply("닉네임을 변경할 수 없습니다."));
    }
});

client.login('MTI3NjE1MjYwMjgxNTUwMDMyOQ.GkTxp9.olXzBqcueCh0DHlOknI_PhnWtdad22YR7pZFVA');