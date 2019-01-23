import axiosdb from 'axios'
import { fConfig } from './f-config.js'

const instance = axiosdb.create({
  baseURL: fConfig.databaseURL
})

export default instance
