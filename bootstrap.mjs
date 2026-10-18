// node bootstrap.mjs <dev.key> <папка> — расшифровывает vision-pack.enc и распаковывает проект в <папка>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createDecipheriv } from 'node:crypto'
import { execSync } from 'node:child_process'
const [keyPath, dir] = process.argv.slice(2)
const key = Buffer.from(readFileSync(keyPath, 'utf8').trim(), 'base64')
const b = readFileSync(new URL('./vision-pack.enc', import.meta.url))
const d = createDecipheriv('aes-256-gcm', key, b.subarray(4, 16))
d.setAuthTag(b.subarray(16, 32))
mkdirSync(dir, { recursive: true })
writeFileSync(`${dir}/pack.zip`, Buffer.concat([d.update(b.subarray(32)), d.final()]))
execSync(`cd "${dir}" && unzip -qo pack.zip && rm pack.zip`)
console.log('ok', dir)
