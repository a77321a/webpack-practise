/*
 * @Descripttion: 
 * @Author: 
 * @Date: 2020-04-03 11:39:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-07 10:36:50
 */
import './css/global.less'
import api, { postRequest } from './api'
//  node_modules/webpack/lib/WebpackOptionsDefaulter.js。 默认配置
console.log(postRequest)
class Animal {
  constructor(name) {
    this.name = name
  }
  getName () {
    return this.name
  }
}


const cat = new Animal('cat')