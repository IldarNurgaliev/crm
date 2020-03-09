import Vue from "vue";
import App from "./App.vue";
import Vuelidate from "vuelidate";
import Paginate from "vuejs-paginate";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";
import tooltipDirective from "@/directives/tooltip.directive";
import messagePlugin from "@/utils/message.plugin";
import Loader from "@/components/app/Loader";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);

Vue.use(Vuelidate);

Vue.component("Loader", Loader);
Vue.component("paginate", Paginate);

Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.filter("localize", localizeFilter);

Vue.directive("tooltip", tooltipDirective);

firebase.initializeApp({
  apiKey: "AIzaSyCaDg9eOMJNSHraYD0KxCyWlpt2BOJWGzE",
  authDomain: "vue-crm-fc04d.firebaseapp.com",
  databaseURL: "https://vue-crm-fc04d.firebaseio.com",
  projectId: "vue-crm-fc04d",
  storageBucket: "vue-crm-fc04d.appspot.com",
  messagingSenderId: "916185258777",
  appId: "1:916185258777:web:9127d0ca33f7eb83840388",
  measurementId: "G-HVGV0W7FP6"
});

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
