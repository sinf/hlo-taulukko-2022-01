/* Awesome personnel management table thingy by Arho M. 1/2022 */

import React from 'react';
import logo from './logo.svg';
import './App.css';

interface Dude {
	person_id : number,
	fname: string,
	lname: string,
	age: number
}
interface DudeTable {
	[person_id: number]: Dude;
}

interface AppState {
	dudes: DudeTable,
	sort_key: string,
	sort_dir: number,
	edit_id: number | null,
}

function choose<T>(x:T[]):T {
	return x[Math.floor(Math.random() * x.length)];
}

function randomDude() : Dude {
	const f = ["Noah", "Oliver", "George", "Leo", "Theo", "Amelia", "Olivia", "Isla", "Ava", "Freya"];
	const l = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson"];
	return {
		fname: choose(f),
		lname: choose(l),
		age: Math.floor(Math.random() * 120),
		person_id: Math.random(),
	};
}

function loadData(): DudeTable {
	let tab:DudeTable = {}
	for(let i=0; i<10; ++i) {
		let d = randomDude();
		tab[d.person_id] = d;
	}
	return tab;
}

class App extends React.Component<{},AppState> {

	private readonly inp_fname = React.createRef<HTMLInputElement>();
	private readonly inp_lname = React.createRef<HTMLInputElement>();
	private readonly inp_age = React.createRef<HTMLInputElement>();

	constructor(props:{}) {
		super(props);
		this.state = {
			dudes : loadData(),
			sort_key : "person_id",
			sort_dir : 1,
			edit_id : null
		};
		this.newDude = this.newDude.bind(this);
		this.removeHim = this.removeHim.bind(this);
		this.sortBy = this.sortBy.bind(this);
		this.fillRandom = this.fillRandom.bind(this);
	}

	sortBy(key: string) {
		let s = this.state;
		let d = s.sort_dir;
		this.setState({sort_key: key, sort_dir: key == s.sort_key ? -d : d});
	}

	validateInput(f:string,l:string,a:string):boolean {
		if (Math.max(f.length, l.length) == 0) {
			alert("Fill in at least either first or last name");
			return false;
		}
		if (isNaN(parseInt(a))) {
			alert("Fill in a valid age");
			return false;
		}
		return true;
	}

	fillInputs(f:string, l:string, a:string) {
		if (this.inp_fname?.current) this.inp_fname.current.value = f;
		if (this.inp_lname?.current) this.inp_lname.current.value = l;
		if (this.inp_age?.current) this.inp_age.current.value = a;
	}

	fillRandom() {
		let d = randomDude();
		this.fillInputs(d.fname, d.lname, d.age.toString());
	}

	getDude(): Dude | null {
		let f = this.inp_fname?.current;
		let l = this.inp_lname?.current;
		let a = this.inp_age?.current;
		if (!f || !l || !a) {
			alert("somethings broken. oops");
			return null;
		}
		if (!this.validateInput(f.value,l.value,a.value)) {
			return null;
		}
		let d:Dude = {
			fname:f.value,
			lname:l.value,
			age:parseInt(a.value),
			person_id: Math.random()
		};
		return d;
	}

	newDude() {
		let d = this.getDude();
		if (!d) return;
		if (this.state.edit_id !== null) {
			// keep the same id around when editing, despite the person temporarily not existing
			d.person_id = this.state.edit_id;
		}
		this.state.dudes[d.person_id] = d;
		this.fillInputs("", "", "");
		this.setState({
			dudes: this.state.dudes,
			edit_id: null,
		});
	}

	removeHim(dude:Dude) {
		delete this.state.dudes[dude.person_id];
		this.setState(this.state);
	}

	headerBut(key: string, label: string) {
		let sk = this.state.sort_dir < 0 ? "sortN" : "sortP";
		return ( <th
				onClick={(e) => this.sortBy(key)}
				className={this.state.sort_key == key ? sk : ""}
				> {label} </th> );
	}

	editHim(dude:Dude) {
		/* editing isn't really editing but deleting and then re-adding a new person */
		this.removeHim(dude);
		this.fillInputs(
			dude.fname,
			dude.lname,
			dude.age.toString()
		);
		this.setState({edit_id : dude.person_id});
	}

	emitDude(d: Dude) {
		let buts = this.state.edit_id === null ? [
			<button onClick={() => this.removeHim(d)}>Delete</button>,
			<button onClick={() => this.editHim(d)}>Edit</button>
		] : [
			<span />,
			<span />,
		];
		buts = buts.map((x,i) => <td key={i}>{x}</td>);
		return (
		<tr key={d.person_id}>
			<td>{d.person_id}</td>
			<td>{d.lname}</td>
			<td>{d.fname}</td>
			<td>{d.age}</td>
			{buts}
		</tr>
		);
	}

	render() {
		const age_of_universe=13.8e9;
		return (
<div className="App">
	<table>
		<thead>
			<tr>
				{this.headerBut("person_id", "Favorite number")}
				{this.headerBut("lname", "Last name")}
				{this.headerBut("fname", "First name")}
				{this.headerBut("age", "Age")}
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td></td>
				<td><input id="lname" type="text" ref={this.inp_lname}/></td>
				<td><input id="fname" type="text" ref={this.inp_fname}/></td>
				<td><input id="age" type="number" min="0" max={age_of_universe} ref={this.inp_age}/></td>
				<td><button onClick={() => {this.newDude()}}>
					{this.state.edit_id == null ? "Add" : "Ok"}
				</button></td>
				<td><button
					style={this.state.edit_id !== null ? {visibility:"hidden"} : {}}
					onClick={() => this.fillRandom()}>Random</button>
				</td>
			</tr>
			{
				Object.values(this.state.dudes)
				.sort((a, b) => (a[this.state.sort_key] < b[this.state.sort_key] ? -1 : 1) * this.state.sort_dir)
				.map((d) => this.emitDude(d))
			}
		</tbody>
	</table>
</div>
		);
	}
}

export default App;

/* btw this was my very first typescript+react project ever
 * although I did have prior knowledge of javascript, DOM and CSS.
 * did you even scroll this far down?
 */

