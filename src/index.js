/*
 * @Descripttion: 
 * @Author: 
 * @Date: 2020-04-03 11:39:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-08 17:39:49
 */
import './css/global.less'
// import api, { postRequest } from './api'
//  node_modules/webpack/lib/WebpackOptionsDefaulter.js。 默认配置
/*
 * @Descripttion: 手写promise
 * @Author:
 * @Date: 2020-04-08 10:13:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-08 15:24:14
 */
// Promise的构造方法接收一个executor()，在new Promise()时就立刻执行这个executor回调
// executor()内部的异步任务被放入宏/微任务队列，等待执行
// then()被执行，收集成功/失败回调，放入成功/失败队列
// executor()的异步任务被执行，触发resolve/reject，从成功/失败队列中取出回调依次执行

// Promise本质是一个状态机
// 且状态只能为以下三种：Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态）
// 状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
// then方法接收两个可选参数，分别对应状态改变时触发的回调。
// then方法返回一个promise。
// then 方法可以被同一个 promise 调用多次。

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function _promise (executor) {
  this._status = PENDING  // Promise状态
  this._resolveStack = [] // 成功队列, resolve时触发
  this._value = undefined
  this._rejectStack = []  // 失败队列, reject时触发
  // 由于resolve/reject是在executor内部被调用, 
  // 因此需要使用箭头函数固定this指向, 否则找不到this._resolveStack
  // 使用self存储this也可以
  let _resolve = (val) => {
    //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
    const run = () => {
      if (this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this._status = FULFILLED              // 变更状态
      this._value = val                     // 储存当前value

      // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
      // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
      while (this._resolveStack.length) {
        const callback = this._resolveStack.shift()
        callback(val)
      }
    }
    setTimeout(run)
  }
  let _reject = (val) => {
    const run = () => {
      if (this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this._status = REJECTED               // 变更状态
      this._value = val                     // 储存当前value
      while (this._rejectStack.length) {
        const callback = this._rejectStack.shift()
        callback(val)
      }
    }
    setTimeout(run)
  }
  // then方法,接收一个成功的回调和一个失败的回调

  executor(_resolve, _reject)
}
_promise.prototype.then = function (resolveFn, rejectFn) {
  // 判断接收的是不是函数
  typeof resolveFn !== 'function' ? resolveFn = value => value : null
  typeof rejectFn !== 'function' ? rejectFn = reason => {
    throw new Error('error msg')
  } : null
  return new _promise((resolve, reject) => {
    const fulfilledFn = value => {
      try {
        let temp = resolveFn(value)
        temp instanceof _promise ? temp.then(resolve, reject) : resolve(temp)
      } catch (error) {
        reject(error)
      }
    }
    // reject同理
    const rejectedFn = error => {
      try {
        let x = rejectFn(error)
        x instanceof _promise ? x.then(resolve, reject) : resolve(x)
      } catch (error) {
        reject(error)
      }
    }
    switch (this._status) {
      case PENDING:
        this._resolveStack.push(fulfilledFn)
        this._rejectStack.push(rejectedFn)
        break;
      case FULFILLED:
        fulfilledFn(this._value)    // this._value是上一个then回调return的值
        break;
      case REJECTED:
        rejectedFn(this._value)
        break;
    }
  })
}



// const p1 = Object.create()
const p1 = new _promise((resolve, reject) => {
  console.log(1)
  resolve(1)
})
console.log(p1._status)
p1.then((res) => {
  console.log(res)
  return 2
}).then().then((res) => {
  console.log(res)
})


