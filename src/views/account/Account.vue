<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// interface User {
//   name: string
//   email: string
//   is_admin: string
//   status: string
//   password: string
//   password_confirmation: string
// }

const user = ref({})

onMounted(() => {
  store.dispatch('me')
    .then(() => {
      user.value = store.getters.user
    })
})
</script>

<template>
  <div>
    <div class="flex">
      <h3 class="text-3xl font-semibold text-gray-700">
        Minha conta
      </h3>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            Dados pessoais
          </h2>

          <form>
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
              <div>
                <label class="text-gray-700" for="username">Nome</label>
                <input
                  v-model="user.name"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                >
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">E-mail</label>
                <input
                  v-model="user.email"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="email"
                >
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">Administrador</label>
                <input
                  v-model="user.is_admin"
                  disabled
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="email"
                >
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">Status</label>
                <input
                  v-model="user.status"
                  disabled
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="email"
                >
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Alterar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            Segurança
          </h2>

          <form>
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label class="text-gray-700" for="username">Senha</label>
                <input
                  v-model="user.password"
                  placeholder="Nova senha"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="password"
                >
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">Confirmar senha</label>
                <input
                  v-model="user.password_confirmation"
                  placeholder="Confirme a nova senha"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="password"
                >
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Alterar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
