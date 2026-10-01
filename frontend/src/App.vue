<template>
  <div class="app">
    <header class="nav">
      <router-link to="/" class="logo">我的博客</router-link>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/admin">后台</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, "Microsoft YaHei", sans-serif;
  background: #f5f5f5;
  color: #333;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav nav a {
  margin-left: 20px;
  color: #666;
  text-decoration: none;
}

.nav nav a:hover {
  color: #409eff;
}

.main {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}
</style>