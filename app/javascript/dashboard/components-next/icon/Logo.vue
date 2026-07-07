<script setup>
import { computed, useAttrs } from 'vue';
import { useMapGetter } from 'dashboard/composables/store';
import { useAccount } from 'dashboard/composables/useAccount';

const DEFAULT_LOGO = '/brand-assets/twobrain-logo-thumbnail.svg';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
});

const attrs = useAttrs();
const globalConfig = useMapGetter('globalConfig/get');
const { currentAccount } = useAccount();

const logoSrc = computed(
  () =>
    props.src ||
    currentAccount.value?.custom_logo_url ||
    globalConfig.value?.logoThumbnail ||
    DEFAULT_LOGO
);
</script>

<template>
  <img
    v-bind="attrs"
    :src="logoSrc"
    :alt="alt"
  />
</template>
