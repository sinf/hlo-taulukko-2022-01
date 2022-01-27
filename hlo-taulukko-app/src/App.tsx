/* Awesome personnel management table thingy by Arho M. 1/2022 */

import React from 'react';
import './App.css';

const the_url = process.env.REACT_APP_BACKEND_URL + "/api/MyPersonnel/";

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

function make_id() : number {
	return Math.floor(Math.random() * 0xFFFFFFFF);
}

function randomDude() : Dude {
	const f = ["Noah", "Oliver", "George", "Leo", "Theo", "Amelia", "Olivia", "Isla", "Ava", "Freya"];
	const l = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson"];
	return {
		fname: choose(f),
		lname: choose(l),
		age: Math.floor(Math.random() * 120),
		person_id: make_id(),
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

function parse_dude(ob:any) : Dude {
	return {
		person_id: parseInt(ob.id),
		fname: ob.fname,
		lname: ob.lname,
		age: parseInt(ob.age)
	};
}

class App extends React.Component<{},AppState> {

	private readonly inp_fname = React.createRef<HTMLInputElement>();
	private readonly inp_lname = React.createRef<HTMLInputElement>();
	private readonly inp_age = React.createRef<HTMLInputElement>();

	constructor(props:{}) {
		super(props);
		this.state = {
			dudes : [],
			sort_key : "person_id",
			sort_dir : 1,
			edit_id : null
		};
		this.newDude = this.newDude.bind(this);
		this.removeHim = this.removeHim.bind(this);
		this.sortBy = this.sortBy.bind(this);
		this.fillRandom = this.fillRandom.bind(this);
		this.got_data = this.got_data.bind(this);
		this.got_data1 = this.got_data1.bind(this);
		this.send_data = this.send_data.bind(this);
		this.update_data = this.update_data.bind(this);
		this.try_remove = this.try_remove.bind(this);
	}

	componentDidMount() {
		this.initialFetch();
	}

	got_data(data: any[]) {
		//console.log("got something"); console.log(data);
		for(let d of data.map(parse_dude)) {
			this.state.dudes[d.person_id] = d;
		}
		this.setState(this.state);
	}

	got_data1(data: any) {
		//console.log("got something"); console.log(data);
		const d = parse_dude(data);
		this.state.dudes[d.person_id] = d;
		this.setState(this.state);
	}

	async initialFetch() {
		console.log("fetch");
		const resp = await fetch(the_url);

		resp.json()
		.then(res => this.got_data(res))
		.catch(err => console.log(err));
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
			person_id: make_id()
		};
		return d;
	}

	newDude() {
		let d = this.getDude();
		let e = this.state.edit_id;
		if (!d) return;
		this.fillInputs("", "", "");
		this.setState({edit_id: null});
		if (e !== null) {
			d.person_id = e;
			this.update_data(d);
		} else {
			this.send_data(d);
		}
	}

	async send_data(d: Dude) {
		const resp = await fetch(the_url, {
			method: "POST",
			body: JSON.stringify({
				// missing id
				fname: d.fname,
				lname: d.lname,
				age: d.age
			}),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		});
		resp.json().then(this.got_data1);
	}

	async update_data(d: Dude) {
		const resp = await fetch(the_url, {
			method: "POST",
			body: JSON.stringify({
				id: d.person_id,
				...d
			}),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		});
		resp.json().then(this.got_data1);
	}

	async try_remove(d: Dude) {
		const resp = await fetch(the_url + d.person_id.toString(), {
			method: "DELETE"
		});
		resp.text().then(() => {
			let i = d.person_id;
			console.log("removed");
			console.log(i);
			delete this.state.dudes[i];
			this.setState(this.state);
		});
	}

	removeHim(dude:Dude) {
		console.log("try remove " + dude.person_id);
		this.try_remove(dude);
	}

	headerBut(key: string, label: string) {
		const sk = this.state.sort_key;
		const sd = this.state.sort_dir;
		let c1 = (sd < 0 ? "sortDesc" : "sortAsc");
		let c = sk == key ? c1 : "nosort";
		return (
		<th
			className="headerBut"
			onClick={(e) => this.sortBy(key)} >
				<span className="label">{label}</span>
				<span className={c}></span>
		</th> );
	}

	editHim(dude:Dude) {
		/* editing isn't really editing but deleting and then re-adding a new person */
		this.fillInputs(
			dude.fname,
			dude.lname,
			dude.age.toString()
		);
		delete this.state.dudes[dude.person_id]; /* delete only on client side */
		this.setState({edit_id : dude.person_id});
	}

	emitDude(d: Dude) {
		let buts = this.state.edit_id === null ? [
			<button onClick={() => this.removeHim(d)}><span>Delete</span></button>,
			<button onClick={() => this.editHim(d)}><span>Edit</span></button>
		] : [
			<span />,
			<span />,
		];
		buts = buts.map((x,i) => <td key={i}>{x}</td>);
		return (
		<tr key={d.person_id}>
			<td><span>{d.person_id}</span></td>
			<td><span>{d.lname}</span></td>
			<td><span>{d.fname}</span></td>
			<td><span>{d.age}</span></td>
			{buts}
		</tr>
		);
	}

	render() {
		const age_of_universe=13.8e9;
		return (
<div className="App debug">
	<div className="title">
		<h1>KESÄ<wbr/>TÖIDEN SOVELLUS<wbr/>KEHITYS<wbr/>TEHTÄVÄT 21.12.2021</h1>
		<h2>- by Arho Mahlamäki (1/2022)</h2>
		<div className="debug">Using backend from {the_url}</div>
	</div>
	<table className="ppl">
		<thead>
			<tr>
				{this.headerBut("person_id", "ID")}
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
					<span>
						{this.state.edit_id == null ? "Add" : "Save"}
					</span>
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

