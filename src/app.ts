import { LitElement, html, customElement, css } from "lit-element";
import '@material/mwc-button'
import '@vdegenne/clipboard-copy'
import clipboardCopy from "@vdegenne/clipboard-copy";

type Puzzle = {
	name: string;
	link: string;
}
type PuzzleList = Puzzle[];


@customElement('app-container')
export class AppContainer extends LitElement {
	puzzleList: PuzzleList = []
	previousPuzzle: Puzzle;

	static styles = [
		css`
		:host {
			--mdc-theme-primary: black;
		}

		.action {
			text-decoration: underline;
			color: blue;
			cursor:pointer;
		}
		`
	]

	constructor() {
		super();
		if (localStorage.getItem('puzzles') !== null) {
			this.puzzleList = JSON.parse(localStorage.getItem('puzzles')!.toString());
		}

		window.addEventListener('keydown', (e) => {
			if (e.key === 'r') {
				if (e.ctrlKey) {
					e.preventDefault()
				}
				this.onRandomClick();
			}
		})
	}

	render() {
		return html`
		<mwc-button raised @click="${this.onRandomClick}">play random (r)</mwc-button>
		<ul>
		  ${this.puzzleList.map((puzzle) => {
				return html`
				<li><a href="${puzzle.link}" target="_blank">${puzzle.name}</a>
				[<span class="action" @click="${() => this.deletePuzzle(puzzle)}">delete</span>]</li>
				`
			})}
		</ul>
		<mwc-button unelevated @click="${this.addNewPuzzle}">add puzzle</mwc-button>
		<mwc-button @click="${this.copyList}">copy list</mwc-button>
		<mwc-button @click=${this.importList}>import list</mwc-button>
		`
	}

	copyList () {
		clipboardCopy(JSON.stringify(this.puzzleList))
	}
	importList () {
		let json: any = prompt('json list');
		if (json === null) return;
		try {
			json = JSON.parse(json) as PuzzleList;
			this.puzzleList = json;
		} catch (e) {
			alert('the list is invalid')
			return;
		}
		this.savePuzzles();
	}

	deletePuzzle (puzzle: Puzzle) {
		const accept = confirm('are you sure ?')
		if (!accept) return;
		this.puzzleList.splice(this.puzzleList.indexOf(puzzle), 1);
		this.savePuzzles()
	}

	onRandomClick() {
		if (this.puzzleList.length === 0) return;

		let random
		do {
			random = this.puzzleList[Math.floor(Math.random() * this.puzzleList.length)]
		} while (this.puzzleList.length > 1 && this.previousPuzzle && random === this.previousPuzzle);
		this.previousPuzzle = random
		window.open(random.link, '_blank');
	}

	addNewPuzzle () {
		const link = prompt('link');
		if (link === null) {
			return;
    }
    
    let pretitle = 'title';

		// get puzzle id
    let puzzleId = /[0-9]{4,}/.exec(link);
    if (puzzleId) {
      pretitle = puzzleId[0];
    }

		const name = prompt('name', pretitle)
		if (name === null) {
			return;
		}
		if (this.puzzleList.some(puzzle => puzzle.name === name)) {
			alert('this puzzle or name already exists');
			return;
		}
		this.addPuzzleToTheList({
			name, link
		});
	}

	addPuzzleToTheList (puzzle: Puzzle) {
		this.puzzleList.push(puzzle);
		this.savePuzzles();
	}

	savePuzzles () {
		localStorage.setItem('puzzles', JSON.stringify(this.puzzleList))
		this.requestUpdate()
	}
}