import './style.css'
import { ToSomewhere } from './src/servers/toSomewhereBtn'
import axios from 'axios'
import { showWelcome } from './src/components/inOutAnimation'
import { gsap } from "gsap"

ToSomewhere.init()

const fetchMethod = {
  "FETCH": "fetch",
  "AXIOS": "axios"
}

const loginBtn = document.querySelector('.login-btn')
const registerBtn = document.querySelector('.register-btn')

registerBtn.addEventListener('click', register)
loginBtn.addEventListener('click', login)

const new_username = document.querySelector('#new-username')
const password_one = document.querySelector('#reg-password-one')
const password_two = document.querySelector('#reg-password-two')

const ERROR = 'error'
const ACTIVE = 'active'

function addClick(doms, type) {
  doms.forEach(dom => {
    dom.addEventListener((type || 'click'), () => {
      removeErrorTag(dom)
    })
  })
}

function addErrorTag(dom) {
  dom.classList.remove(ERROR)
  dom.classList.add(ERROR)
}

function removeErrorTag(dom) {
  dom.classList.remove(ERROR)
}

function inputEmpty(doms) {
  let status = false
  doms.forEach(dom => {
    if (dom.value === '') {
      addErrorTag(dom)
      status = true
    }
  })
  return status
}


function correctShow() {
  const tween = gsap.timeline()
  tween.to('body', { duration: 0, background: "#fff" })
  tween.to('body', { duration: 1, ease: "power2", background: "#d3f261" })
  tween.to('body', { duration: 1, ease: "power2", background: "#fff" })
}


function errorShow() {
  const tween = gsap.timeline()
  tween.to('body', { duration: 0, background: "#fff" })
  tween.to('body', { duration: 1, ease: "power2", background: "#ff7875" })
  tween.to('body', { duration: 1, ease: "power2", background: "#fff" })
}


function unknownShow() {
  const tween = gsap.timeline()
  tween.to('body', { duration: 0, background: "#fff" })
  tween.to('body', { duration: 1, ease: "power2", background: "#ffec3d" })
  tween.to('body', { duration: 1, ease: "power2", background: "#fff" })
}

addClick([new_username, password_one, password_two])

async function register(event) {
  event.preventDefault()
  if (inputEmpty([new_username, password_one, password_two])) {
    errorShow()
    return
  }


  if (password_one.value === password_two.value) {
    const address = 'http://localhost:7890/api/register'
    const method = fetchMethod.AXIOS
    const response = await postPassword(method, address, new_username.value, password_one.value)
    console.log(response)

    switch (Number(response.code)) {
      case 0:
        correctShow()
        break;
      case 1:
        errorShow()
        addErrorTag(new_username)
        break;

      case 2:
        errorShow()
        addErrorTag(password_one)
        addErrorTag(password_two)
        break;


      default:
        unknownShow()
        break;
    }

  }
}



const username = document.querySelector('#username')
const password = document.querySelector('#password')


addClick([username, password])
async function login(event) {
  event.preventDefault()
  if (inputEmpty([username, password])) {
    errorShow()
    return
  }
  const response = await axios.post("http://localhost:7890/api/user", {
    username: username.value,
    password: password.value
  }).then(res => res.data).catch(err => console.error(err))

  console.log(response)
  switch (Number(response.code)) {
    case 0:
      correctShow()
      showWelcome()
      break;
    case 1:
      errorShow()
      addErrorTag(username)
      break;
    case 2:
      errorShow()
      addErrorTag(password)
      break;

    default:
      unknownShow()
      break;
  }
}



async function postPassword(method, address, username, password) {
  switch (method) {
    case fetchMethod.FETCH:
      return fetch(address, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username, password
        })
      }).then(res => res.json())

    case fetchMethod.AXIOS:
      return axios.post(address, {
        username, password
      }).then(res => res.data).catch(err => {
        console.error(err);
      })




    default:
      return null

  }
}