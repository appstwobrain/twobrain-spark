<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';
import { useAccount } from 'dashboard/composables/useAccount';
import { useMapGetter, useStore } from 'dashboard/composables/store';
import NextButton from 'dashboard/components-next/button/Button.vue';

const { t } = useI18n();
const store = useStore();
const { currentAccount, updateAccount } = useAccount();
const uiFlags = useMapGetter('accounts/getUIFlags');
const fileInput = ref(null);

const defaultLogoUrl = '/brand-assets/twobrain-logo.svg';
const logoUrl = computed(() => currentAccount.value?.custom_logo_url || '');
const effectiveLogoUrl = computed(() => logoUrl.value || defaultLogoUrl);
const accountName = computed(() => currentAccount.value?.name || '');
const isUpdating = computed(() => uiFlags.value.isUpdating);

const openFilePicker = () => {
  fileInput.value?.click();
};

const updateLogo = async event => {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    await updateAccount({ custom_logo: file });
    useAlert(t('GENERAL_SETTINGS.FORM.LOGO.UPDATE.SUCCESS'));
  } catch {
    useAlert(t('GENERAL_SETTINGS.FORM.LOGO.UPDATE.ERROR'));
  } finally {
    event.target.value = '';
  }
};

const deleteLogo = async () => {
  try {
    await store.dispatch('accounts/deleteLogo');
    useAlert(t('GENERAL_SETTINGS.FORM.LOGO.DELETE.SUCCESS'));
  } catch {
    useAlert(t('GENERAL_SETTINGS.FORM.LOGO.DELETE.ERROR'));
  }
};
</script>

<template>
  <div class="grid gap-4">
    <div
      class="flex min-h-24 flex-col items-start justify-between gap-4 rounded-lg border border-n-weak bg-n-solid-2 px-4 py-3 sm:flex-row sm:items-center"
    >
      <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        <div
          class="flex h-14 w-44 flex-shrink-0 items-center justify-center rounded-md border border-n-weak bg-n-background p-3"
        >
          <img
            :src="effectiveLogoUrl"
            :alt="accountName"
            class="max-h-10 max-w-full object-contain"
          />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-n-slate-12">
            {{ t('GENERAL_SETTINGS.FORM.LOGO.CURRENT') }}
          </p>
          <p
            v-if="!logoUrl"
            class="mt-1 text-sm text-n-slate-11"
          >
            {{ t('GENERAL_SETTINGS.FORM.LOGO.EMPTY') }}
          </p>
          <p class="mt-1 text-sm text-n-slate-11">
            {{ t('GENERAL_SETTINGS.FORM.LOGO.HELP') }}
          </p>
        </div>
      </div>
      <div class="flex flex-shrink-0 flex-wrap items-center gap-2">
        <NextButton
          slate
          faded
          sm
          type="button"
          icon="i-lucide-upload"
          :is-loading="isUpdating"
          @click="openFilePicker"
        >
          {{ t('GENERAL_SETTINGS.FORM.LOGO.UPLOAD') }}
        </NextButton>
        <NextButton
          v-if="logoUrl"
          ruby
          ghost
          sm
          type="button"
          icon="i-lucide-trash-2"
          :is-loading="isUpdating"
          @click="deleteLogo"
        >
          {{ t('GENERAL_SETTINGS.FORM.LOGO.REMOVE') }}
        </NextButton>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml"
      class="sr-only"
      @change="updateLogo"
    />
  </div>
</template>
