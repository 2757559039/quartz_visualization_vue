<!-- src/components/SseComponent.vue -->
<template>
  <div>
    <h1>Server-Sent Events (SSE)</h1>
    <div v-if="eventData">
      <p>Message: {{ eventData }}</p>
      <p>Counter: {{ eventData }}</p>
    </div>
    <div v-else>
      <p>Waiting for events...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventData: null,
    };
  },
  mounted() {
    this.initSse();
  },
  methods: {
    initSse() {
      const eventSource = new EventSource('http://172.17.170.107:8002/sse/definedJobSubscribe?cacheKey=123');
      eventSource.onmessage = (event) => {
        this.eventData = event.data;
      };
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
      };
    },
  },
};
</script>