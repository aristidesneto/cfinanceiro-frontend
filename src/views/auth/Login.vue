<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

interface FormData {
  email: string
  password: string
}

interface Message {
  error: string
  btn_text: string
}

const isDisabled = ref(false)
const btnText = 'Entrar'

const dataLogin = ref<FormData>({
  email: 'aristides@admin.com',
  password: 'password',
})

const message = ref<Message>({
  error: '',
  btn_text: btnText,
})

function finished() {
  isDisabled.value = false
  message.value.btn_text = btnText
}

function loading() {
  isDisabled.value = true
  message.value.btn_text = 'Aguarde...'
}

onMounted(() => {
  store.dispatch('me')
    .then(() => router.push('dashboard'))
})

function login() {
  loading()
  if (dataLogin.value.email === '' || dataLogin.value.password === '') {
    message.value.error = 'Informe as credenciais de login'
    finished()
    return false
  }

  const payload = {
    email: dataLogin.value.email,
    password: dataLogin.value.password,
  }

  store.dispatch('onLogin', { payload })
    .then(() => router.push('dashboard'))
    .catch((errors) => {
      message.value.error = errors.response.data.errors
      finished()
    })
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-10 h-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-2xl font-semibold text-gray-700">Controle Financeiro</span>
      </div>

      <div v-if="message.error" class="flex mt-4">
        <span class="font-semibold text-red-500">
          {{ message.error }}
        </span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">E-mail</span>
          <input
            v-model="dataLogin.email"
            type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Senha</span>
          <input
            v-model="dataLogin.password"
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Lembrar senha</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
            >Esqueci minha senha</a>
          </div>
        </div>

        <div class="mt-6">
          <button
            :disabled="isDisabled"
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            v-text="message.btn_text"
          />
        </div>
      </form>
    </div>
  </div>
</template>
