// @ts-check

/* 
  블로그 포스팅 서비스
  - 로컬 파일을 데이터베이스로 활용할 예정(JSON)
  - 인증 로직은 넣지 않음
  - RESTful API를 사용함
*/

const http = require('http')
/**
 * Post
 * 
 * GET /posts
 * GET /posts/:id
 * POST /posts
 * 
 * */ 

const server = http.createServer((req, res) => {
  if(req.url === '/posts' && req.method === 'GET') {
    res.statusCode = 200
    res.end('List of posts!')
  } else if(req.url && /^\/posts\/[a-zA-Z0-9-_]+$/.test(req.url)) {
    // 정규식을 이용해 id형식에 맞는 모든것이 로그인되도록 함
    // ^ (시작)   /host/  [조건들조건들]   + (여러개) $ (끝) 
    res.statusCode = 200
    res.end('Some content of the post')
  } else if(req.url === '/posts' && req.method === 'POST') {
    res.statusCode = 200
    res.end('Creating post!')
  } else {
    res.statusCode = 404
    // 404 ERROR -> 찾지 못했을 때 오류코드
    res.end('Not Found!!!!!')
  }
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
