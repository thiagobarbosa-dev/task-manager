require 'rails_helper'

RSpec.describe "TaskItems", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/task_items/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/task_items/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/task_items/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/task_items/edit"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/task_items/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/task_items/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/task_items/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /toggle_status" do
    it "returns http success" do
      get "/task_items/toggle_status"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /pending" do
    it "returns http success" do
      get "/task_items/pending"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /completed" do
    it "returns http success" do
      get "/task_items/completed"
      expect(response).to have_http_status(:success)
    end
  end

end
