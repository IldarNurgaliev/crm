import localize from "@/filters/localize.filter";
export default {
  install(Vue) {
    Vue.prototype.$message = function(html) {
      // eslint-disable-next-line no-undef
      M.toast({ html });
    };
    Vue.prototype.$error = function(html) {
      // eslint-disable-next-line no-undef
      M.toast({ html: `[${localize("Error")}]:${html}` });
    };
  }
};
