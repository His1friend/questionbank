// store/index.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: localStorage.getItem('userName') || '',
    userId: localStorage.getItem('userId') || null,
    role: parseInt(localStorage.getItem('role')) || null,
  }),
  
  actions: {
    setUser({ userName, userId, role }) {
      this.userName = userName;
      this.userId = userId;
      this.role = role;
      
      // 保存到 localStorage
      localStorage.setItem('userName', userName);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
    },
    
    logout() {
      this.userName = '';
      this.userId = null;
      this.role = null;
      
      // 清除 localStorage
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    },

    // 初始化方法
    initializeFromStorage() {
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      
      if (userName && userId && role) {
        this.userName = userName;
        this.userId = userId;
        this.role = parseInt(role);
      }
    }
  }
})