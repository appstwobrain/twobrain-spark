class ForceTwobrainBrandingConfig < ActiveRecord::Migration[7.1]
  BRANDING_CONFIG = {
    'INSTALLATION_NAME' => 'TwoBrain',
    'BRAND_NAME' => 'TwoBrain',
    'LOGO_THUMBNAIL' => '/brand-assets/twobrain-logo-thumbnail.svg',
    'LOGO' => '/brand-assets/twobrain-logo.svg',
    'LOGO_DARK' => '/brand-assets/twobrain-logo-dark.svg',
    'BRAND_URL' => nil,
    'WIDGET_BRAND_URL' => nil,
    'TERMS_URL' => nil,
    'PRIVACY_URL' => nil
  }.freeze

  def up
    BRANDING_CONFIG.each do |name, value|
      config = InstallationConfig.find_or_initialize_by(name: name)
      config.value = value
      config.locked = true
      config.save!
    end

    GlobalConfig.clear_cache
  end
end
