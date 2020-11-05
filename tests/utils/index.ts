import { readFileSync } from 'fs'
import { join } from 'path'

export const loadFile = (name: string): string => readFileSync(join(__dirname, `../fixtures/${name}`), 'utf-8')
