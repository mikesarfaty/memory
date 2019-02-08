defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  # join new game w/ name
  def join(conn, %{"name" => name}) do
    render conn, "game.html", name: name # name param given via post or url match
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
