defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  # join method based on tuck's HangmanWeb join
  # there's really only one way to do this part..
  def join("games:" <> name, payload, socket) do
    game = BackupAgent.get(name) || Game.new
    BackupAgent.put(name, game)
    socket = socket
             |> assign(:game, game)
             |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  # also based on tuck's starter code...
  # also only one way to really do this
  def handle_in("flip", %{"index" => index}, socket) do
    name = socket.assigns[:name]
    new_game_state = Game.flip(socket.assigns[:game], index)
    socket = assign(socket, :game, new_game_state)
    BackupAgent.put(name, new_game_state)
    {:reply, {:ok, %{"game" => Game.client_view(new_game_state)}}, socket}
  end

  def handle_in("new", _whatever, socket) do
    name = socket.assigns[:name]
    new_game = Game.new
    BackupAgent.put(name, new_game)
    socket = socket
             |> assign(:game, new_game)
             |> assign(:name, name)
    {:reply, {:ok, %{"game" => Game.client_view(new_game)}}, socket}
  end

end
