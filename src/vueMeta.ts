import Vue from "vue";
import Component from "vue-class-component";
import VueMeta from "vue-meta";

Vue.use(VueMeta);
Component.registerHooks(["metaInfo"]);
