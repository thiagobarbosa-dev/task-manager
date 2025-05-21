class ApplicationController < ActionController::Base
  before_action :set_locale
  before_action :authenticate_user!

  # Adicione esta linha para incluir os helpers do Devise
  include Devise::Controllers::Helpers

  def after_sign_in_path_for(resource)
    authenticated_root_path
  end

  def after_sign_out_path_for(resource)
    locale_root_path(locale: I18n.locale)
  end

  private

  def set_locale
    Rails.logger.debug "--- set_locale: params[:locale] = #{params[:locale]}" # Log de debug

    locale_from_params = params[:locale] if params[:locale].present?
    locale_from_user = current_user.try(:preferred_locale) # Assumindo que o usuário tem um atributo preferred_locale
    locale_from_session = session[:locale]

    determined_locale = if locale_from_params && I18n.available_locales.map(&:to_s).include?(locale_from_params)
                          Rails.logger.debug "--- set_locale: Using locale from params: #{locale_from_params}"
                          locale_from_params
    elsif locale_from_user && I18n.available_locales.map(&:to_s).include?(locale_from_user.to_s)
                          Rails.logger.debug "--- set_locale: Using locale from user preference: #{locale_from_user}"
                          locale_from_user
    elsif locale_from_session && I18n.available_locales.map(&:to_s).include?(locale_from_session.to_s)
                           Rails.logger.debug "--- set_locale: Using locale from session: #{locale_from_session}"
                           locale_from_session
    else
                          Rails.logger.debug "--- set_locale: Using default locale or browser preference"
                          I18n.default_locale
    end

    I18n.locale = determined_locale || I18n.default_locale # Define o locale final
    session[:locale] = I18n.locale.to_s # Opcional: Armazenar o locale na sessão para persistência

    Rails.logger.debug "--- set_locale: Final I18n.locale = #{I18n.locale}" # Log de debug
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
