defmodule Memory.Game do

  def new do
    %{
      board: next_board(),
      flipped: [], # indexes
      solved: [], # indexes
      clicks: 0,
    }
  end

  def letters do
    ["a", "b", "c", "d", "e", "f", "g", "h"]
  end

  def next_board do
    board = Enum.map(0..15, fn x -> 
      %{
        index: x,
        letter: Enum.at(letters(), rem(x, 8)),
      } 
    end)
    |> Enum.shuffle

    Enum.map 0..15, fn x ->
      %{
        index: x,
        letter: Enum.at(board, x).letter
      }
    end
  end

  def client_view(game) do
    client_board = Enum.map(game.board, fn tile ->
      cond do
        Enum.member?(game.flipped, tile.index) ->
          %{
            view: tile.letter,
            index: tile.index
          }
        Enum.member?(game.solved, tile.index) ->
          %{
            view: tile.letter,
            index: tile.index
          }
        true ->
          %{
            view: "O",
            index: tile.index
          }
      end
    end)
    %{
      skel: client_board,
      clicks: game.clicks,
      flipped: game.flipped
    }
  end

  def flip(game, index) do
    cond do
      Enum.member?(game.flipped, index) ->
        game
      Enum.member?(game.solved, index) ->
        game
      Enum.count(game.flipped) == 0 ->
        %{
          board: game.board,
          flipped: [index],
          solved: game.solved,
          clicks: game.clicks + 1
        }
      Enum.count(game.flipped) == 1 -> (
        [first] = game.flipped
        letter_at_first = Enum.at(game.board, first).letter
        letter_at_second = Enum.at(game.board, index).letter
        if letter_at_first == letter_at_second do
          solved = [first, index | game.solved]
          %{
            board: game.board,
            flipped: [],
            solved: solved,
            clicks: game.clicks + 1
          }
        else
          %{
            board: game.board,
            flipped: [first, index],
            solved: game.solved,
            clicks: game.clicks + 1
          }
        end)
      Enum.count(game.flipped) == 2 ->
        %{
          board: game.board,
          flipped: [index],
          solved: game.solved,
          clicks: game.clicks + 1
        }
    end
  end

end
