export default function ({ $axios, app }, inject) {
  // At this point app.$auth is undefined. (Unless you use setTimeout but that is not a solution)

  //Create axios instance
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json', //accept json
      },
    },
  })
  // Here is the magic, onRequest is an interceptor, so every request made will go trough this, and then we try to access app.$auth inside it, it is defined
  api.onRequest((config) => {
    // Here we check if user is logged in
    if (app.$auth.loggedIn) {
      // If the user is logged in we can now get the token, we get something like `Bearer yourTokenJ9F0JFODJ` but we only need the string without the word **Bearer**, So we split the string using the space as a separator and we access the second position of the array **[1]**

      const token = app.$auth.strategy.token.get().split(' ')[1]
      api.setToken(token, 'Bearer') // Here we specify the token and now it works!!
    }
  })

  // Set baseURL to something different
  // api.setBaseURL("http://localhost:8000/api/v1")

  // Inject to context as $api
  inject('api', api)
}
