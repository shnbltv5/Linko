<template>
  <div class="video-card">
    <!-- Кликабельный превью-блок -->
    <a
      class="thumb"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      :title="`Open: ${title}`"
    >
      <div class="thumb-placeholder">{{ thumbnailText }}</div>
    </a>

    <div class="info">
      <!-- Кликабельный заголовок -->
      <a
        class="title-link"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3 class="title">{{ title }}</h3>
      </a>
      <p class="channel">{{ channel }}</p>
      <p class="meta">{{ views.toLocaleString() }} views</p>
    </div>

    <div class="actions">
      <button
        class="icon-btn"
        :class="{ active: userLiked }"
        :aria-pressed="userLiked"
        @click="onLike"
        title="Like"
      >
        👍
      </button>
      <span class="count">{{ likes }}</span>

      <!-- Просто показываем число дизлайков (как в твоем текущем шаблоне) -->
      <span class="count">{{ dislikes }}</span>

      <!-- Кнопка Watch (опционально) -->
      <a
        class="watch-btn"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        title="Watch on YouTube"
      >
        ▶️ Watch
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: [Number, String],
  title: String,
  channel: String,
  views: Number,
  thumbnail: String,
  likes: Number,
  dislikes: Number,
  url: String, // <— новая ссылка на видео
  userLiked: { type: Boolean, default: false },
  userDisliked: { type: Boolean, default: false },
});

const emits = defineEmits(["liked", "disliked"]);

const thumbnailText = computed(() =>
  props.title ? props.title.slice(0, 2).toUpperCase() : "YT"
);

function onLike() {
  emits("liked", props.id);
}
</script>

<style scoped>
.video-card {
  display: flex;
  gap: 14px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 14px;
  align-items: center;
  box-shadow: var(--card-shadow);
  transition: 0.3s;
}
.video-card:hover {
  transform: translateY(-3px);
}
.thumb {
  width: 120px;
  height: 70px;
  background: var(--thumb-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #777;
  font-weight: 700;
  text-decoration: none;
}
.info {
  flex: 1;
  min-width: 0;
}
.title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}
.title-link {
  text-decoration: none;
  color: inherit;
}
.title-link:hover .title {
  text-decoration: underline;
}
.channel {
  margin: 2px 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.meta {
  font-size: 12px;
  color: var(--text-secondary);
}
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  width: 38px;
  height: 36px;
  display: grid;
  place-items: center;
  border: none;
  background: var(--btn-bg);
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 10px;
  transition: 0.2s;
}
.icon-btn:hover {
  background: var(--btn-hover);
}
.icon-btn.active {
  outline: 2px solid var(--btn-hover);
  transform: translateY(-1px);
}
.count {
  min-width: 28px;
  text-align: right;
  color: var(--text-primary);
  opacity: 0.85;
  font-weight: 600;
}
.watch-btn {
  text-decoration: none;
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 8px;
  color: var(--text-primary);
  background: var(--btn-bg);
}
.watch-btn:hover {
  background: var(--btn-hover);
}
</style>
