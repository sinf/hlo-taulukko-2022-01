/* Awesome personnel management table thingy by Arho M. 1/2022 */

import React from 'react';
import './App.css';

const the_url = process.env.REACT_APP_BACKEND_URL + "/api/MyPersonnel/";
const enable_debug = false;

console.log("using backend", the_url);

interface Person {
	person_id : number,
	fname: string,
	lname: string,
	age: number
}
interface PersonTable {
	[person_id: number]: Person;
}

interface WhoIsInvalid {
	[id: number]: boolean
}

interface AppState {
	dudes: PersonTable,
	invalid: WhoIsInvalid,
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

function randomDude() : Person {
	const f = ["Noah", "Oliver", "George", "Leo", "Theo", "Amelia", "Olivia", "Isla", "Ava", "Freya"];
	const l = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson"];
	return {
		fname: choose(f),
		lname: choose(l),
		age: Math.floor(Math.random() * 120),
		person_id: make_id()
	};
}

function loadData(count: number): PersonTable {
	let tab:PersonTable = {}
	for(let i=0; i<count; ++i) {
		let d = randomDude();
		tab[d.person_id] = d;
	}
	return tab;
}

function parse_dude(ob:any) : Person {
	return {
		person_id: parseInt(ob.id),
		fname: ob.fname,
		lname: ob.lname,
		age: parseInt(ob.age)
	};
}

function JSON_stringify_sorted(obj:any)
{
	let keys:any = {};
	JSON.stringify(obj, (k,v) => (keys[k]=null, v)); // intentional comma operator
	keys = Object.keys(keys).sort();
	return JSON.stringify(obj, keys);
}

function deepEqual(a:any, b:any):boolean {
	return JSON_stringify_sorted(a) === JSON_stringify_sorted(b);
}

async function debug_delay(x:any):any {
	if (enable_debug) {
		console.log("debug delay");
		await new Promise(a => setTimeout(a, 5000));
	}
	return x;
}

class App extends React.Component<{},AppState> {

	private readonly inp_fname = React.createRef<HTMLInputElement>();
	private readonly inp_lname = React.createRef<HTMLInputElement>();
	private readonly inp_age = React.createRef<HTMLInputElement>();

	constructor(props:{}) {
		super(props);
		this.state = {
			dudes : {},
			invalid : {},
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

		// Re-fetch the entire table all the time in case other clients also make changes
		// this is really inefficient but probably ok for a small demo
		setInterval(() => this.initialFetch(), 2000);
	}

	got_data(data: any[]) {
		//console.log("got something"); console.log(data);
		//let temp:PersonTable = Object.assign({}, this.state.dudes);
		let temp:PersonTable = {}; // replace everything
		for(let d of data.map(parse_dude)) {
			temp[d.person_id] = d;
		}
		delete temp[this.state.edit_id];
		if (!deepEqual(temp, this.state.dudes)) {
			console.log("fetch everything ", new Date().toISOString());
			this.setState({dudes: temp, invalid: {}});
		}
	}

	got_data1(data: any) {
		// added (or edited) one row from this client
		//console.log("got something"); console.log(data);
		const d = parse_dude(data);
		let temp:PersonTable = Object.assign({}, this.state.dudes);
		temp[d.person_id] = d;
		this.setState({dudes: temp});
		this.setValid(d);
	}

	async initialFetch() {
		//console.log("fetch");
		await fetch(the_url)
		.then(resp => resp.json())
		.then(j => this.got_data(j))
		.catch(err => console.log(err));
	}

	sortBy(key: string) {
		let s = this.state;
		let d = s.sort_dir;
		this.setState({sort_key: key, sort_dir: key === s.sort_key ? -d : d});
	}

	validateInput(f:string,l:string,a:string):boolean {
		if (Math.max(f.length, l.length) === 0) {
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

	getDude(): Person | null {
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
		let d:Person = {
			fname:f.value,
			lname:l.value,
			age:parseInt(a.value),
			person_id: make_id()
		};
		return d;
	}

	setInvalid(d:Person) {
		let inv:WhoIsInvalid = Object.assign({}, this.state.invalid);
		inv[d.person_id] = true;
		this.setState({invalid: inv});
	}
	setValid(d:Person) {
		delete this.state.invalid[d.person_id];
		this.setState({invalid: this.state.invalid});
	}

	newDude() {
		let d = this.getDude();
		let e = this.state.edit_id;
		if (!d) return;
		this.fillInputs("", "", "");
		this.setState({edit_id: null});
		this.setInvalid(d);
		if (e !== null) {
			d.person_id = e;
			this.update_data(d);
		} else {
			this.send_data(d);
		}
	}

	async send_data(d: Person) {
		await fetch(the_url, {
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
		})
		.then(debug_delay)
		.then(x => x.json())
		.then(this.got_data1)
		.catch(err => console.log(err));
	}

	async update_data(d: Person) {
		await fetch(the_url, {
			method: "POST",
			body: JSON.stringify({
				id: d.person_id,
				fname: d.fname,
				lname: d.lname,
				age: d.age
			}),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then(debug_delay)
		.then(x => x.json())
		.then(this.got_data1)
		.catch(err => console.log(err));
	}

	async try_remove(d: Person) {
		this.setInvalid(d);
		await fetch(the_url + d.person_id.toString(), {
			method: "DELETE"
		})
		.then(debug_delay)
		.then(x => x.text())
		.then(() => {
			let i = d.person_id;
			console.log("removed");
			console.log(i);
			this.setValid(d);
			delete this.state.dudes[i];
			this.setState(this.state);
		})
		.catch(err => console.log(err));
	}

	removeHim(dude:Person) {
		console.log("try remove " + dude.person_id);
		this.try_remove(dude);
	}

	headerBut(key: string, label: string) {
		const sk = this.state.sort_key;
		const sd = this.state.sort_dir;
		let c1 = (sd < 0 ? "sortDesc" : "sortAsc");
		let c = sk === key ? c1 : "nosort";
		return (
		<th
			className="headerBut"
			onClick={(e) => this.sortBy(key)} >
				<span className="label">{label}</span>
				<span className={c}></span>
		</th> );
	}

	editHim(dude:Person) {
		/* editing isn't really editing but deleting and then re-adding a new person */
		this.fillInputs(
			dude.fname,
			dude.lname,
			dude.age.toString()
		);
		delete this.state.dudes[dude.person_id]; /* delete only on client side */
		this.setState({edit_id : dude.person_id});
	}

	emitDude(d: Person) {
		let buts = (this.state.edit_id === null) && !(d.person_id in this.state.invalid) ? [
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
<div className={"App" + (enable_debug ? " debug" : "")}>
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

