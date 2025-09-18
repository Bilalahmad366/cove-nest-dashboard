<template>
    <div class="skeleton-loader">
      <!-- Loader Lines -->
      <div 
        v-for="index in lines" 
        :key="index" 
        :class="theme == 'dark' ? 'skeleton-line-dark' : 'skeleton-line'"
        :style="{ height, width, borderRadius }"
      ></div>
    </div>
  </template>
  
  <script>
  import { useAppStore } from "@/core/store";
  export default {
    name: "SkeletonLoader",
    props: {
      lines: {
        type: Number,
        default: 3, // Default number of skeleton lines
      },
      height: {
        type: String,
        default: "20px", // Default height of each skeleton line
      },
      width: {
        type: String,
        default: "100%", // Default width of each skeleton line
      },
      borderRadius: {
        type: String,
        default: "4px", // Default border radius for skeleton lines
      },
    },
    computed: {
    theme() {
      const store = useAppStore(); // Use the Pinia store
      return store.theme; // Access the theme from the store
    },
  },
  };
  </script>
  
  <style scoped>
  .skeleton-loader {
    height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 12px; /* Space between skeleton lines */
  }
  
  /* Base skeleton line styles */
  .skeleton-line {
    position: relative;
    overflow: hidden;
    background-color: #e0e0e0;
    width: 100%; /* Default width; can be overridden with props */
    height: 20px; /* Default height; can be overridden with props */
    border-radius: 4px; /* Default border radius; can be overridden with props */
  }
  /* Base skeleton line styles */
  .skeleton-line-dark{
    background-color: rgba(26, 41, 65, 1);
  }
  
  /* Add white blur layer using a pseudo-element */
  .skeleton-line::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%; /* Start outside the element */
    height: 100%;
    width: 150%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite; /* Smooth forward animation */
    filter: blur(4px); /* Add a blur effect to the white layer */
  }
  
  /* Keyframes for the forward shimmer movement */
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  </style>
  