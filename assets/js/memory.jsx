import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}


class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {
            skel: this.init_view(),
            clicks: 0,
            flipped: []
        }

        this.channel
            .join()
            .receive("ok", this.got_view.bind(this))
            .receive("error", resp => { console.log("Unable to join", resp); });
    }

    init_view() {
        let view = [];
        for (let i = 0; i < 16; i++) {
            view.push({index: i, view: "O"})
        }
        return view;
    }

    got_view(view) {
        this.setState(view.game);
        if (this.state.flipped.length == 2) {
            setTimeout(this.hide_flipped.bind(this), 1000);
        }
    }

    on_flip(flipped_idx, _ev) {
        this.channel.push("flip", { index: flipped_idx })
            .receive("ok", this.got_view.bind(this));
    }

    reset(_ev) {
        this.channel.push("new", {})
            .receive("ok", this.got_view.bind(this))
    }

    renderSquare(sq) {
        return (<p onClick={this.on_flip.bind(this, sq.index)}>{sq.view}</p>);
    }

    getRow(rowNum) {
        let rowSquares = [];
        for (let i = rowNum * 4; i < (rowNum + 1) * 4; i++) {
            rowSquares.push(<div key={i} className="column">
                                {this.renderSquare(this.state.skel[i])}
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

    hide_flipped() {
        let new_board = this.state.skel;
        new_board[this.state.flipped[0]] = {index: this.state.flipped[0], view: "O"};
        new_board[this.state.flipped[1]] = {index: this.state.flipped[1], view: "O"};
        let new_state = this.state;
        new_state.skel = new_board;
        new_state.flipped = [];
        this.setState(new_state);
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
