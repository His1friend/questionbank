import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '',
    userId: null,
  }),
  actions: {
    setUser({ userName, userId }) {
      this.userName = userName;
      this.userId = userId;
    },
    logout() {
      this.userName = '';
      this.userId = null;
    },
  }
});
