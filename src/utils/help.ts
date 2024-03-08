/**
 * eval替代函数
 * @param code 
 */
export function exec(code: string) {
  // 使用Function构造函数将传入的code作为函数体创建一个新的函数，并立即执行这个新函数
  new Function(code)()
}
