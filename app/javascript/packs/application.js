require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");
require("jquery");

import Vue from "vue/dist/vue.esm";
import App from "../app.vue";

document.addEventListener("turbolinks:load", function () {
  var element = document.querySelector("#boards");
  if (element != undefined) {
    const app = new Vue({
      el: element,
      data: {
        lists: JSON.parse(element.dataset.lists),
      },
      template: "<App :original_lists='lists' />",
      components: { App },
    });
  }
});
