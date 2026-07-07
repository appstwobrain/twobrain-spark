class BrandAssetsCacheControl
  NO_CACHE_HEADERS = {
    'Cache-Control' => 'no-store, no-cache, max-age=0, must-revalidate',
    'Pragma' => 'no-cache',
    'Expires' => '0'
  }.freeze

  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)
    path = env['PATH_INFO'].to_s

    headers.merge!(NO_CACHE_HEADERS) if path.start_with?('/brand-assets/')

    [status, headers, response]
  end
end

Rails.application.config.middleware.insert_before ActionDispatch::Static, BrandAssetsCacheControl
