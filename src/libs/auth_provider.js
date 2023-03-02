// Giả sử bạn có cài đặt như sau cho auth-provider.  
// Trên thực tế bạn không nên lưu token vào localStorage
const localStorageKey = 'token'

async function getToken() {
  // Nếu bạn sử dụng token provider như auth0, tại đây bạn sẽ gọi API
  // để lấy token, bạn không nên lưu token vào localStorage, đây chỉ là demo
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse({user}) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function login({username, password}) {
  return client('login', {username, password}).then(handleUserResponse)
}

function register({username, password}) {
  return client('register', {username, password}).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

const authURL = 'https:localhost:5001/connect/token'

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  }

  return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {getToken, login, register, logout, localStorageKey}