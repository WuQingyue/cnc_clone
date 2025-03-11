import request from '@/utils/request'

// 基础 URL 配置
const BASE_URL = '/api/auth'

/**
 * 获取二维码
 * @returns {Promise} 返回二维码信息
 */
export const getQrcode = () => {
  return request({
    url: `${BASE_URL}/qrcode/generate`,
    method: 'get'
  })
}

/**
 * 检查二维码状态
 * @param {string} qrcodeId - 二维码ID
 * @returns {Promise} 返回二维码状态
 */
export const checkQrcodeStatus = (qrcodeId) => {
  return request({
    url: `${BASE_URL}/qrcode/check/${qrcodeId}`,
    method: 'get'
  })
}

/**
 * 发送手机验证码
 * @param {Object} data - 请求数据
 * @param {string} data.phone - 手机号
 * @returns {Promise} 返回发送结果
 */
export const sendVerifyCode = (data) => {
  return request({
    url: `${BASE_URL}/verify-code/send`,
    method: 'post',
    data
  })
}

/**
 * 验证手机验证码
 * @param {Object} data - 请求数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @returns {Promise} 返回验证结果
 */
export const verifyPhone = (data) => {
  return request({
    url: `${BASE_URL}/verify-code/check`,
    method: 'post',
    data
  })
}

/**
 * 注册用户
 * @param {Object} data - 注册数据
 * @param {string} data.phone - 手机号
 * @param {string} data.openId - 微信 OpenID
 * @returns {Promise} 返回注册结果
 */
export const register = (data) => {
  return request({
    url: `${BASE_URL}/register`,
    method: 'post',
    data
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @returns {Promise} 返回登录结果
 */
export const login = (data) => {
  return request({
    url: `${BASE_URL}/login`,
    method: 'post',
    data
  })
}

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export const logout = () => {
  return request({
    url: `${BASE_URL}/logout`,
    method: 'post'
  })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfo = () => {
  return request({
    url: `${BASE_URL}/user/info`,
    method: 'get'
  })
}

/**
 * 设置登录密码
 * @param {Object} data - 密码数据
 * @param {string} data.password - 新密码
 * @param {string} data.confirmPassword - 确认密码
 * @returns {Promise} 返回设置结果
 */
export const setPassword = (data) => {
  return request({
    url: `${BASE_URL}/user/password`,
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param {Object} data - 重置数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回重置结果
 */
export const resetPassword = (data) => {
  return request({
    url: `${BASE_URL}/user/reset-password`,
    method: 'post',
    data
  })
}

/**
 * 验证滑块验证码
 * @param {Object} data - 验证数据
 * @param {number} data.x - 滑块x坐标
 * @param {number} data.y - 滑块y坐标
 * @returns {Promise} 返回验证结果
 */
export const verifySlide = (data) => {
  return request({
    url: `${BASE_URL}/verify-slide`,
    method: 'post',
    data
  })
}

/**
 * 检查手机号是否已注册
 * @param {string} phone - 手机号
 * @returns {Promise} 返回检查结果
 */
export const checkPhone = (phone) => {
  return request({
    url: `${BASE_URL}/check-phone/${phone}`,
    method: 'get'
  })
}

/**
 * 绑定手机号
 * @param {Object} data - 绑定数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.openId - 微信 OpenID
 * @returns {Promise} 返回绑定结果
 */
export const bindPhone = (data) => {
  return request({
    url: `${BASE_URL}/bind-phone`,
    method: 'post',
    data
  })
}

/**
 * 获取微信绑定状态
 * @returns {Promise} 返回绑定状态
 */
export const getWechatBindStatus = () => {
  return request({
    url: `${BASE_URL}/wechat/bind-status`,
    method: 'get'
  })
}

/**
 * 解绑微信
 * @returns {Promise} 返回解绑结果
 */
export const unbindWechat = () => {
  return request({
    url: `${BASE_URL}/wechat/unbind`,
    method: 'post'
  })
}
