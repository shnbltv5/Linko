<template>
  <div :class="['app', theme]">
    <header>
      <h1>Mini YouTube Dashboard</h1>
      <div class="theme-toggle">
        <button @click="toggleTheme">
          {{ theme === "light" ? "🌙 Dark" : "☀️ Light" }}
        </button>
      </div>
    </header>

    <section class="controls">
      <input
        v-model="searchQuery"
        placeholder="Search by title or channel..."
        class="search"
      />
      <button class="sort-btn" @click="toggleSort">
        Sort by Views {{ sortByViews ? "↑" : "↓" }}
      </button>
    </section>

    <div v-if="isLoading" class="loading">Loading videos...</div>

    <section v-else class="videos">
      <div class="status-bar">
        <span>Found: {{ foundCount }}</span>
        <span>Total likes: {{ totalLikes }}</span>
      </div>

      <div v-if="filteredVideos.length === 0" class="empty">
        No videos found.
      </div>

      <div v-else class="list">
        <VideoCard
          v-for="video in filteredVideos"
          :key="video.id"
          v-bind="video"
          @liked="handleLiked"
        />
      </div>
    </section>

    <footer>
      <p>Made by <strong>Жанторе</strong> 💻</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VideoCard from "./components/VideoCard.vue";
import { useVideos } from "./composables/useVideos";

const {
  filteredVideos,
  searchQuery,
  totalLikes,
  foundCount,
  isLoading,
  sortByViews,
  likeVideo,
  toggleSort,
} = useVideos();

const theme = ref("light");
function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

function handleLiked(videoId) {
  likeVideo(videoId);
}
</script>

<style>
.app {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 16px;
  font-family: "Inter", Arial, sans-serif;
  transition: 0.3s background, 0.3s color;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  font-size: 1.6rem;
  margin: 0;
}
.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 16px 0;
}
.search {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text-primary);
}
.sort-btn {
  background: var(--btn-bg);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  transition: 0.2s;
}
.sort-btn:hover {
  background: var(--btn-hover);
}
.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: var(--text-secondary);
}
.status-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
}
.videos .list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.empty {
  color: var(--text-secondary);
  padding: 30px;
  text-align: center;
}
footer {
  margin-top: 20px;
  text-align: right;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Light & Dark Themes */
.light {
  --bg: #fafafa;
  --text-primary: #222;
  --text-secondary: #666;
  --card-bg: #fff;
  --btn-bg: #eaeaea;
  --btn-hover: #d5d5d5;
  --border: #ddd;
  --input-bg: #fff;
  --thumb-bg: #f4f4f4;
  --card-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background: var(--bg);
  color: var(--text-primary);
}
.dark {
  --bg: #1e1e1e;
  --text-primary: #f1f1f1;
  --text-secondary: #999;
  --card-bg: #2a2a2a;
  --btn-bg: #333;
  --btn-hover: #444;
  --border: #444;
  --input-bg: #2a2a2a;
  --thumb-bg: #333;
  --card-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  background: var(--bg);
  color: var(--text-primary);
}
</style>
