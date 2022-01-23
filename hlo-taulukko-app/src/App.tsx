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

function loadData(): DudeTable {
	return {
		100: { fname:"John", lname:"Doe", age:45, person_id:100 }
	};
}

interface AppState {
	dudes: DudeTable
}

class App extends React.Component<{},AppState> {

	private readonly inp_fname = React.createRef<HTMLInputElement>();
	private readonly inp_lname = React.createRef<HTMLInputElement>();
	private readonly inp_age = React.createRef<HTMLInputElement>();

	constructor(props:{}) {
		super(props);
		this.state = {
			dudes : loadData(),
		};
		this.newDude = this.newDude.bind(this);
		this.removeHim = this.removeHim.bind(this);
	}

	newDude(event:object) {
		let f = this.inp_fname?.current;
		let l = this.inp_lname?.current;
		let a = this.inp_age?.current;
		if (!f || !l || !a) {
			alert("somethings broken. oops");
			return;
		}
		let i = Math.random();
		this.state.dudes[i] = {
			fname:f.value,
			lname:l.value,
			age:parseInt(a.value),
			person_id:i
		};
		this.setState(this.state);
	}

	removeHim(dude:Dude) {
		delete this.state.dudes[dude.person_id];
		this.setState(this.state);
	}

	render() {
		return (
<div className="App">
	<table>
		<thead>
			<tr>
				<th>Favorite number</th>
				<th>First name</th>
				<th>Last name</th>
				<th>Age</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td></td>
				<td><input id="fname" type="text" ref={this.inp_fname}/></td>
				<td><input id="lname" type="text" ref={this.inp_lname}/></td>
				<td><input id="age" type="number" ref={this.inp_age}/></td>
				<td><button onClick={this.newDude}>Add</button></td>
			</tr>
			{
				Object.values(this.state.dudes).map(d =>
					<tr key={d.person_id}>
						<td>{d.person_id}</td>
						<td>{d.fname}</td>
						<td>{d.lname}</td>
						<td>{d.age}</td>
						<td><button onClick={() => this.removeHim(d)}>Delete</button></td>
					</tr>
				)
			}
		</tbody>
	</table>
</div>
		);
	}
}

/*
function App() {
  return (
    <div className="App">
      <TableThingy />
    </div>
  );
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
}
*/

export default App;
