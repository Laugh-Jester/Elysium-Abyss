import { createPinia } from 'pinia'

import persist from 'pinia-plugin-persistedstate'


const pinia=createPinia()
pinia.use(persist)

export default pinia

import {user} from './modules/user.js'
export {user}

import {theme} from './modules/theme.js'
export {theme}

import {count} from './modules/count.js'
export {count}

import {article} from './modules/article.js'
export {article}

import {tag} from './modules/tag.js'
export {tag}

import {photo} from './modules/photo_wall.js'
export {photo}

import {useDanmakuStore} from './modules/danmaku.js'
export {useDanmakuStore}
