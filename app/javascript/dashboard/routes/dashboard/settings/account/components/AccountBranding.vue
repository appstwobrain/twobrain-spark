<script setup>
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';
import { useAccount } from 'dashboard/composables/useAccount';
import { useMapGetter } from 'dashboard/composables/store';
import NextButton from 'dashboard/components-next/button/Button.vue';
import {
  DEFAULT_BRANDING,
  getAccountBranding,
  isValidBrandingColor,
  normalizeBrandingSettings,
} from 'dashboard/helper/accountBranding';

const { t } = useI18n();
const { currentAccount, updateAccount } = useAccount();
const uiFlags = useMapGetter('accounts/getUIFlags');

const branding = reactive({ ...DEFAULT_BRANDING });
const isUpdating = computed(() => uiFlags.value.isUpdating);

const colorFields = computed(() => [
  {
    key: 'primary_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.PRIMARY_COLOR'),
  },
  {
    key: 'primary_text_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.PRIMARY_TEXT_COLOR'),
  },
  {
    key: 'surface_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.SURFACE_COLOR'),
  },
  {
    key: 'sidebar_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.SIDEBAR_COLOR'),
  },
  {
    key: 'card_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.CARD_COLOR'),
  },
  {
    key: 'secondary_button_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.SECONDARY_BUTTON_COLOR'),
  },
  {
    key: 'secondary_button_hover_color',
    label: t('GENERAL_SETTINGS.FORM.BRANDING.SECONDARY_BUTTON_HOVER_COLOR'),
  },
]);

const syncBranding = () => {
  Object.assign(branding, getAccountBranding(currentAccount.value));
};

watch(() => currentAccount.value?.settings?.branding, syncBranding, {
  immediate: true,
  deep: true,
});

const normalizeColor = key => {
  const value = branding[key]?.trim();
  if (isValidBrandingColor(value)) {
    branding[key] = value.toUpperCase();
  }
};

const saveBranding = async () => {
  const hasInvalidColor = Object.values(branding).some(
    color => !isValidBrandingColor(color)
  );

  if (hasInvalidColor) {
    useAlert(t('GENERAL_SETTINGS.FORM.BRANDING.UPDATE.INVALID'));
    return;
  }

  try {
    await updateAccount({ branding: normalizeBrandingSettings(branding) });
    useAlert(t('GENERAL_SETTINGS.FORM.BRANDING.UPDATE.SUCCESS'));
  } catch {
    useAlert(t('GENERAL_SETTINGS.FORM.BRANDING.UPDATE.ERROR'));
  }
};

const resetBranding = () => {
  Object.assign(branding, DEFAULT_BRANDING);
};
</script>

<template>
  <div class="grid gap-4">
    <div
      class="grid gap-5 rounded-lg border border-n-weak bg-n-solid-1 px-4 py-4"
    >
      <div class="flex flex-col justify-between gap-4 sm:flex-row">
        <div class="min-w-0">
          <p class="text-sm font-medium text-n-slate-12">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.TITLE') }}
          </p>
          <p class="mt-1 max-w-xl text-sm text-n-slate-11">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.HELP') }}
          </p>
        </div>
        <div class="flex flex-shrink-0 items-center gap-2">
          <NextButton
            slate
            faded
            sm
            type="button"
            icon="i-lucide-rotate-ccw"
            @click="resetBranding"
          >
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.RESET') }}
          </NextButton>
          <NextButton
            blue
            sm
            type="button"
            icon="i-lucide-save"
            :is-loading="isUpdating"
            @click="saveBranding"
          >
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.SAVE') }}
          </NextButton>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="field in colorFields"
          :key="field.key"
          class="grid gap-2 rounded-lg border border-n-weak bg-n-background px-3 py-3"
        >
          <span class="text-sm font-medium text-n-slate-11">
            {{ field.label }}
          </span>
          <span class="flex items-center gap-2">
            <input
              v-model="branding[field.key]"
              type="color"
              class="h-9 w-12 flex-shrink-0 cursor-pointer rounded-md border border-n-weak bg-transparent p-1"
              @blur="normalizeColor(field.key)"
            />
            <input
              v-model="branding[field.key]"
              type="text"
              maxlength="7"
              class="min-w-0 flex-1 rounded-lg border-0 bg-n-alpha-black2 px-3 py-2 text-sm text-n-slate-12 outline outline-1 -outline-offset-1 outline-n-weak transition-colors focus:outline-n-container"
              @blur="normalizeColor(field.key)"
            />
          </span>
        </label>
      </div>

      <div
        class="flex flex-col gap-3 rounded-lg border border-n-weak bg-n-solid-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium text-n-slate-12">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.PREVIEW_TITLE') }}
          </p>
          <p class="mt-1 text-sm text-n-slate-11">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.PREVIEW_HELP') }}
          </p>
        </div>
        <div class="flex flex-shrink-0 items-center gap-2">
          <NextButton blue sm type="button">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.PRIMARY_PREVIEW') }}
          </NextButton>
          <NextButton slate faded sm type="button">
            {{ t('GENERAL_SETTINGS.FORM.BRANDING.SECONDARY_PREVIEW') }}
          </NextButton>
        </div>
      </div>
    </div>
  </div>
</template>
