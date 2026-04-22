import { ref, computed, watch, onMounted } from "vue";

export function useVideos() {
  const videos = ref([]);
  const searchQuery = ref("");
  const totalLikes = ref(0);
  const foundCount = ref(0);
  const isLoading = ref(true);
  const sortByViews = ref(false);

  function fetchVideos() {
    isLoading.value = true;
    setTimeout(() => {
      const mock = [
        {
          id: 1,
          title: "Twenty One Pilots - City Walls",
          channel: "twenty one pilots",
          views: 23000,
          thumbnail: "",
          likes: 12,
          url: "https://youtu.be/5Ozjel72yjQ?si=V39T3fDqLa4j3fPB",
        },
        {
          id: 2,
          title: "Twenty One Pilots - Paladin Strait",
          channel: "twenty one pilots",
          views: 890000,
          thumbnail: "",
          likes: 315,
          url: "https://youtu.be/mix9YfaaNa0?si=AO8MMLy0icx3AHMB",
        },
        {
          id: 3,
          title: "Twenty One Pilots - Jumpsuit",
          channel: "twenty one pilots",
          views: 415000,
          thumbnail: "",
          likes: 189,
          url: "https://youtu.be/UOUBW8bkjQ4?si=qTUWuBb2bQ8-5bNh",
        },
        {
          id: 4,
          title: "Twenty One Pilots - Fairly Local",
          channel: "twenty one pilots",
          views: 650000,
          thumbnail: "",
          likes: 240,
          url: "https://youtu.be/HDI9inno86U?si=L6L-NCBzsQlPMMta",
        },
      ];

      videos.value = mock.map((v) => ({
        ...v,
        dislikes: v.dislikes ?? 0,
        userLiked: false,
      }));
      totalLikes.value = videos.value.reduce((s, v) => s + v.likes, 0);
      foundCount.value = videos.value.length;
      isLoading.value = false;
    }, 600);
  }

  const filteredVideos = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let result = videos.value;
    if (q) {
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channel.toLowerCase().includes(q)
      );
    }
    if (sortByViews.value) {
      result = [...result].sort((a, b) => b.views - a.views);
    }
    return result;
  });

  watch(
    filteredVideos,
    (newVal) => {
      foundCount.value = newVal.length;
    },
    { immediate: true }
  );

  function likeVideo(videoId) {
    const v = videos.value.find((x) => x.id === videoId);
    if (!v) return;
    if (v.userLiked) {
      v.userLiked = false;
      v.likes = Math.max(0, v.likes - 1);
    } else {
      v.userLiked = true;
      v.likes += 1;
    }
    totalLikes.value = videos.value.reduce((s, vv) => s + vv.likes, 0);
  }

  function toggleSort() {
    sortByViews.value = !sortByViews.value;
  }

  onMounted(fetchVideos);

  return {
    videos,
    filteredVideos,
    searchQuery,
    totalLikes,
    foundCount,
    isLoading,
    sortByViews,
    likeVideo,
    fetchVideos,
    toggleSort,
  };
}
