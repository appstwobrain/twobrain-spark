const DEFAULT_BRANDING = {
  primary_color: '#C0FA21',
  primary_text_color: '#203300',
  surface_color: '#FBFAF6',
  sidebar_color: '#F4F3EC',
  card_color: '#FFFEFA',
  secondary_button_color: '#FFFEFA',
  secondary_button_hover_color: '#EEECE2',
};

const CSS_VARIABLES = {
  primary_color: ['--blue-5', '--solid-blue'],
  primary_text_color: ['--blue-11', '--blue-12', '--text-blue'],
  surface_color: ['--background-color', '--surface-1'],
  sidebar_color: ['--solid-2'],
  card_color: ['--surface-2', '--solid-1', '--card-color'],
  secondary_button_color: ['--button-color'],
  secondary_button_hover_color: ['--button-hover-color'],
};

const HEX_COLOR_REGEX = /^#(?:[0-9a-f]{3}){1,2}$/i;

const expandHex = hex => {
  const normalizedHex = hex.replace('#', '').trim();
  if (normalizedHex.length === 6) return normalizedHex;

  return normalizedHex
    .split('')
    .map(character => `${character}${character}`)
    .join('');
};

export const isValidBrandingColor = color => {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color.trim());
};

export const hexToRgbValue = color => {
  const expandedHex = expandHex(color);
  const red = parseInt(expandedHex.slice(0, 2), 16);
  const green = parseInt(expandedHex.slice(2, 4), 16);
  const blue = parseInt(expandedHex.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
};

export const normalizeBrandingSettings = branding => {
  return Object.keys(DEFAULT_BRANDING).reduce((acc, key) => {
    const value = branding?.[key];
    acc[key] = isValidBrandingColor(value)
      ? value.trim().toUpperCase()
      : DEFAULT_BRANDING[key];
    return acc;
  }, {});
};

export const getAccountBranding = account => {
  return normalizeBrandingSettings(account?.settings?.branding || {});
};

export const applyAccountBranding = account => {
  if (typeof document === 'undefined') return;

  const branding = getAccountBranding(account);
  const rootStyle = document.documentElement.style;

  Object.entries(CSS_VARIABLES).forEach(([settingKey, variableNames]) => {
    const rgbValue = hexToRgbValue(branding[settingKey]);
    variableNames.forEach(variableName => {
      rootStyle.setProperty(variableName, rgbValue);
    });
  });
};

export { DEFAULT_BRANDING };
