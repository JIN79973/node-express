const express = require('express');
const fs = require('fs');
const app = express();

// 유저 데이터 저장용 파일 및 데이터 로드
const userDataFile = 'userDB.json';
let userDB = {};

if (fs.existsSync(userDataFile)) {
    userDB = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
}

// 로블록스 사용자의 인증 상태 확인
app.get('/check-auth/:robloxUsername', (req, res) => {
    const robloxUsername = req.params.robloxUsername;
    const user = Object.values(userDB).find(u => u.robloxUsername === robloxUsername);

    if (user) {
        res.json({ isAuthenticated: true, userId: user.id });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// API 서버 실행
app.listen(3000, () => {
    console.log('API 서버가 포트 3000에서 실행 중입니다.');
});
