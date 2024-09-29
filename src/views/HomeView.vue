<template>
  <div>
    <h1>Welcome</h1>
    <p>Explore our site and learn more about what we offer.</p>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  text-align: center;
  color: #edecec;
}

.about h1 {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  color: #ffffff;
  transition: color 0.3s ease;
}

.about h1:hover {
  color: #007bff;
}

.about p {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .about h1 {
    font-size: 3rem;
  }

  .about p {
    font-size: 1rem;
  }
}
</style>
