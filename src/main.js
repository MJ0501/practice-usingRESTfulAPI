// @ts-check

/* 
  블로그 포스팅 서비스
  - 로컬 파일을 데이터베이스로 활용할 예정(JSON)
  - 인증 로직은 넣지 않음
  - RESTful API를 사용함
*/

const http = require('http')
const { routes } = require('./api') // api중에서 routes만 가져옴

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    )
    // route.callback() -> 아래에 !route가 return되므로 이곳에서 route type = undefined
    if (!req.url || !route) {
      res.statusCode = 404
      res.end('Not Found!')
      return
    }

    const regexResult = route.url.exec(req.url)

    if (!regexResult) {
      res.statusCode = 404
      res.end('Not found!')
      return
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try{
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Ill-formed json'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult,reqBody)
    // 굳이 if로 존재확인할 필요X - 당연히 route가 존재함
    res.statusCode = result.statusCode

    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
      // res.end 에서 end는 string으로만 출력이 되므로, Obejct를 받게 되면
      // error가 생김. -> JSON.stringify로 넘겨줌.
    }
  }
  main()
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
