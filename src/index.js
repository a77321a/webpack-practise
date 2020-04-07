/*
 * @Descripttion: 
 * @Author: 
 * @Date: 2020-04-03 11:39:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-03 16:57:20
 */
import './css/global.less'

//  node_modules/webpack/lib/WebpackOptionsDefaulter.js。 默认配置
class Animal {
  constructor(name) {
    this.name = name
  }
  getName () {
    return this.name
  }
}

const cat = new Animal('cat')