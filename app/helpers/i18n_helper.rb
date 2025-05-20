module I18nHelper
  def locale_flag(locale)
    case locale.to_s
    when "pt-BR"
      "🇧🇷"
    when "en"
      "🇺🇸"
    when "es"
      "🇪🇸"
    else
      locale.to_s.upcase
    end
  end

  def locale_name(locale)
    case locale.to_s
    when "pt-BR"
      "Português"
    when "en"
      "English"
    when "es"
      "Español"
    else
      locale.to_s.upcase
    end
  end

  def translated_model_name(model, count = 1)
    t("activerecord.models.#{model.to_s.underscore}", count: count)
  end

  def translated_attribute_name(model, attribute)
    t("activerecord.attributes.#{model.to_s.underscore}.#{attribute}")
  end
end
