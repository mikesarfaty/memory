import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}


class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.initSquares(),
            clicks: 0
        }
    }

    initSquares() {
        let squares = [];
        let availableLetters = [
            "a", "b", "c", "d", "e", "f", "g", "h",
            "a", "b", "c", "d", "e", "f", "g", "h"
        ]
        for (let i = 0; i < 16; i++) {
            squares.push({
                id: i,
                value: availableLetters.splice(Math.floor(Math.random() * availableLetters.length), 1)[0],
                flipped: false,
                solved: false
            });
        }
        return squares;
    }

    flipAnother(flippedIdx) {
        if (this.state.board[flippedIdx].solved ||
            this.state.board[flippedIdx].flipped) {
            return;
        }
        this.findMatches();
        let newBoard = [];
        for (let i = 0; i < 16; i++) {
            newBoard.push(this.state.board[i]);
        }
        newBoard[flippedIdx].flipped = true;
        
        let newState = _.assign(
            {},
            this.state,
            {
                board: newBoard,
                clicks: this.state.clicks + 1
            });
        this.setState(newState);
    }


    renderSquare(sq) {
        if (sq.flipped || sq.solved) {
            return (<p onClick={this.flipAnother.bind(this, sq.id)}>
                        {sq.value}
                    </p>);
        }
        else {
            return (<p onClick={this.flipAnother.bind(this, sq.id)}>
                        {"O"}
                    </p>);
        }
    }

    getRow(rowNum) {
        let rowSquares = [];
        for (let i = rowNum * 4; i < (rowNum + 1) * 4; i++) {
            rowSquares.push(<div key={i} className="column">
                                {this.renderSquare(this.state.board[i])}
                            </div>);
        }
        return rowSquares;
    }

    getRows() {
        let rows = [];
        for (let i = 0; i < 4; i++) {
            rows.push(<div className="row" key={i}>
                        {this.getRow(i)}
                      </div>);
        }
        return rows;
    }

    findMatches() {
        let matchedSquares = [];
        for (let i = 0; i < 16; i++) {
            if (this.state.board[i].flipped) {
                matchedSquares.push(this.state.board[i]);
            }
        }

        if (matchedSquares.length == 2) {
                let newBoard = this.state.board;
            if (matchedSquares[0].value == matchedSquares[1].value) {
                newBoard[matchedSquares[0].id].solved = true;
                newBoard[matchedSquares[1].id].solved = true;
            }
            newBoard[matchedSquares[0].id].flipped = false;
            newBoard[matchedSquares[1].id].flipped = false;
            this.setState(
                {
                    board: newBoard,
                    clicks: this.state.clicks
                });
        }
    }

    reset(_ev) {
        this.setState({
            board: this.initSquares(),
            clicks: 0
        });
    }

    render() {
        return (
            <div>
                {this.getRows()}
                <div className="row">
                    <div className="column">
                        <button onClick={this.reset.bind(this)}>
                            Reset the game!
                        </button>
                    </div>
                    <div className="column">
                        <p>Clicks: {this.state.clicks}</p>
                    </div>
                </div>
            </div>
        );
    }
}
