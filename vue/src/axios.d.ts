import Vue from "vue";
import axios, { AxiosStatic } from "axios";

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosStatic;
  }
}
