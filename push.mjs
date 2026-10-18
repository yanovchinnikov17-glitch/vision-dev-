// Шифрует пак ключом dev.key и готовит файлы для репозитория: vision-pack.enc + pack.json (id = sha256 шифрованного файла)
import { readFileSync, writeFileSync } from 'node:fs'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'
const [zipPath, version, outDir, keyPath] = process.argv.slice(2)
const key = Buffer.from(readFileSync(keyPath, 'utf8').trim(), 'base64')
const zip = readFileSync(zipPath)
const iv = randomBytes(12)
const c = createCipheriv('aes-256-gcm', key, iv)
const body = Buffer.concat([c.update(zip), c.final()])
const enc = Buffer.concat([Buffer.from('VPK1'), iv, c.getAuthTag(), body])
const id = createHash('sha256').update(enc).digest('hex')
writeFileSync(`${outDir}/vision-pack.enc`, enc)
writeFileSync(`${outDir}/pack.json`, JSON.stringify({ id, size: enc.length, version }) + '\n')
console.log('ok', version, enc.length, id.slice(0, 12))
