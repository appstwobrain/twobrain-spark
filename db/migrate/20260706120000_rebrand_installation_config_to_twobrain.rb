class RebrandInstallationConfigToTwobrain < ActiveRecord::Migration[7.1]
  def up
    update_config('INSTALLATION_NAME', 'TwoBrain')
    update_config('BRAND_NAME', 'TwoBrain')
    update_config('LOGO_THUMBNAIL', '/brand-assets/twobrain-logo-thumbnail.svg')
    update_config('LOGO', '/brand-assets/twobrain-logo.svg')
    update_config('LOGO_DARK', '/brand-assets/twobrain-logo-dark.svg')
    update_config('BRAND_URL', nil)
    update_config('WIDGET_BRAND_URL', nil)
    update_config('TERMS_URL', nil)
    update_config('PRIVACY_URL', nil)
    GlobalConfig.clear_cache
  end

  private

  def update_config(name, value)
    config = InstallationConfig.find_by(name: name)
    return if config.blank?

    config.update!(value: value)
  end
end
